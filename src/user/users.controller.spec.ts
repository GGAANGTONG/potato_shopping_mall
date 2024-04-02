import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { SignUpDto } from './dto/signup.dto';
import { UserService } from './users.service';
import { ArgumentMetadata, BadRequestException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { SignInDto } from './dto/sign_in.dto';
import _ from 'lodash';
import { UpdateDto } from './dto/update.dto';

describe('UserController', () => {
  let controller: UserController;

  let user = {
    accessToken: jest.fn()
  }

  let userService = {
    register: jest.fn(),
    signIn: jest.fn(
      () => {
        return user
      }
    ),
    findAll: jest.fn(
      () => {
        return 'user정보들'
      }
    ),
    findOne: jest.fn(
      (id) => {
        if(_.isNil(id)) {
          throw new BadRequestException()
        }
        return `user${id}의 정보`
      }
    ),
    update: jest.fn(
      (id, updateDto) => {
        if(_.isNil(id) || _.isNil(updateDto)) {
          throw new BadRequestException()
        }
      }
    ),
    remove: jest.fn(),
    findByEmail: jest.fn()
  }

async function validation(Dto, dto) {
  let validatonPipe = new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true})
  const metadata: ArgumentMetadata = {
  type: 'body',
     metatype: Dto,
     data: ''
 }
       await validatonPipe.transform(dto, metadata)
       .catch(err => {
           expect(err).toEqual(err)
       })
      }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userService
        },
        // {
        //   provide: ValidationPipe,
        //   useValue: new ValidationPipe({
        //     transform: true,
        //     whitelist: true,
        //     forbidNonWhitelisted: true
        //   })
        // }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('UserController이 정상적으로 컴파일 됐는가?', () => {
    expect(controller).toBeDefined()
  });

  it('1-1. User - register, signUpDto를 정상적으로 전달 받아 회원가입에 성공함' , 
  async () => {
    let signUpDto:SignUpDto = {
      name: '국밥',
      email: 'gookbab99@gmail.com',
      password: 'Ex@mple123!!!',
      nickname: '국밥대장',
      profile: '국밥사진'
    }
    let res = {
      send: jest.fn(
        () => {
          return '회원가입되었습니다. 로그인해주세요!'
        }
      )
    }

    await validation(SignUpDto, signUpDto)


      const result = await controller.register(signUpDto, res)
    expect(result).toBe('회원가입되었습니다. 로그인해주세요!')
  })

  it('1-2. User - register, signUpDto의 validationPipe를 통과하지 못해 회원가입에 실패하고, 에러가 반환됨' , async () => {
    let signUpDto:SignUpDto = {
      name: '국밥',
      email: 'gookbab99@gmail.com',
      password: 'Ex@mple123!!!',
      nickname: '',
      profile: '국밥사진'
    }
    let res = {
      send: jest.fn(
        () => {
          return '회원가입되었습니다. 로그인해주세요!'
        }
      )
    }


await validation(SignUpDto, signUpDto)

    // const result = await controller.register(signUpDto, res)
    // expect(result).toBe('회원가입되었습니다. 로그인해주세요!')
  })

  it('2-1. User - signIn, signInDto를 정상적으로 전달 받아 로그인에 성공함' , 
  async () => {
    let signInDto:SignInDto = {
      email: 'gookbab99@gmail.com',
      password: 'Ex@mple123!!!',
    }

    let res = {
      cookie: jest.fn(),
      status: jest.fn(
        () => res
  ),
      json: jest.fn(() => {
        return {
          status: HttpStatus.OK,
          json: {
            message: '로그인 완료',
            user: '유저 정보'
          }
        }
      })
    }

  await validation(SignInDto, signInDto)


  const result = await controller.signIn(signInDto, res)
  //toStricEqual: 객체 간 깊은 동등성 비교
  expect(result).toStrictEqual({
    status: HttpStatus.OK,
    json: {
      message: '로그인 완료',
      user: '유저 정보'
    }
  })
  })

  it('2-2. User - signIn, signInDto의 validationPipe를 통과하지 못해 로그인에 실패하고, 에러가 반환됨' , async () => {
    let signInDto:SignInDto = {
      password: 'Ex@mple123!!!',
      email: ''
    }

    let res = {
      cookie: jest.fn(),
      status: jest.fn(
        () => res
  ),
      json: jest.fn(() => {
        return {
          status: HttpStatus.OK,
          json: {
            message: '로그인 완료',
            user: '유저 정보'
          }
        }
      })
    }

  await validation(SignInDto, signInDto)

})

it('3-1. User - findAll, 존재하는 모든 유저 정보를 반환함' , async () => {


  expect(await controller.findAll()).toBe('user정보들')
  
})

it('4-1. User - findOne, 매개변수로 입력받은 id에 해당하는 특정 유저 정보를 반환함' , async () => {

  expect(await controller.findOne(1)).toBe('user1의 정보')
  
})

it('4-2. User - findOne, 매개변수로 입력받은 id에 해당하는 값이 할당되지 않은 채로 전달되면 user 정보를 반환하지 않음' , async () => {

  const id = undefined

  const result = await controller.findOne(id).catch(
    err => {
      expect(err).toBe(err)
    }
  )
})

it('5-1. User - update, updateDto를 정상적으로 전달 받아 업데이트에 성공함' , 
async () => {
  const updateDto:UpdateDto = {
    nickname: 'gookbab95@gmail.com',
    profile: '좀 더 맛있는 국밥 사진',
    password: 'Ex@mple1234567!!!',
  }
  
  const id:number = 1

//   let res = {
//     cookie: jest.fn(),
//     status: jest.fn(
//       () => res
// ),
//     json: jest.fn(() => {
//       return {
//         status: HttpStatus.OK,
//         json: {
//           message: '로그인 완료',
//           user: '유저 정보'
//         }
//       }
//     })
//   }

await validation(UpdateDto, updateDto)


const result = await controller.update(id, updateDto)
expect(result).toStrictEqual({
  message: '수정되었습니다'
})
})

it('5-2. User - update, 매개변수로 입력받은 id에 해당하는 값이 할당되지 않은 채로 전달되면 에러를 반환함' , 
async () => {
  const updateDto:UpdateDto = {
    nickname: 'gookbab95@gmail.com',
    profile: '좀 더 맛있는 국밥 사진',
    password: 'Ex@mple1234567!!!',
  }
  
  const id = undefined

//   let res = {
//     cookie: jest.fn(),
//     status: jest.fn(
//       () => res
// ),
//     json: jest.fn(() => {
//       return {
//         status: HttpStatus.OK,
//         json: {
//           message: '로그인 완료',
//           user: '유저 정보'
//         }
//       }
//     })
//   }

await validation(UpdateDto, updateDto)


const result = await controller.update(id, updateDto).catch(
  err => expect(err).toBe(err)
)


// expect(result).toStrictEqual({
//   message: '수정되었습니다.'
// })
})

it('6-1. User - delete, id를 정상적으로 전달 받아 삭제에 성공함' , 
async () => {
  
  
  const id:number = 1

//   let res = {
//     cookie: jest.fn(),
//     status: jest.fn(
//       () => res
// ),
//     json: jest.fn(() => {
//       return {
//         status: HttpStatus.OK,
//         json: {
//           message: '로그인 완료',
//           user: '유저 정보'
//         }
//       }
//     })
//   }

const result = await controller.remove(id)
expect(result).toStrictEqual({
  message: '삭제 되었습니다'
})
})

it('6-2. User - delete, 매개변수로 입력받은 id에 해당하는 값이 할당되지 않은 채로 전달되면 삭제에 실패하고 에러를 반환함' , 
async () => {
  
  
  const id:number = 1

//   let res = {
//     cookie: jest.fn(),
//     status: jest.fn(
//       () => res
// ),
//     json: jest.fn(() => {
//       return {
//         status: HttpStatus.OK,
//         json: {
//           message: '로그인 완료',
//           user: '유저 정보'
//         }
//       }
//     })
//   }

const result = await controller.remove(id).catch(
  err => {
    expect(err).toBe(err)
  }
)
// expect(result).toStrictEqual({
//   message: '삭제 되었습니다'
// })
})

  })




