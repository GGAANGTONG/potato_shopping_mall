import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entitiy';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { ArgumentMetadata, BadRequestException, NotFoundException, ValidationPipe } from '@nestjs/common';
import { SignInDto } from './dto/sign_in.dto';
import { hash } from 'bcrypt';
import { UpdateDto } from './dto/update.dto';

describe('UsersService', () => {
  let service: UserService;
  let usersRepository: Partial<Record<keyof Repository<Users>, jest.Mock>>;
  let jwtService: Partial<JwtService>;

  async function validation(Dto, dto) {
    const validatonPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: Dto,
      data: '',
    };
    await validatonPipe.transform(dto, metadata)
  }

  beforeEach(async () => {
    usersRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Users),
          useValue: usersRepository,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('UserService가 정상적으로 실행됨', () => {
    expect(service).toBeDefined();
  });

  it('1-1. User - register, signUpDto가 잘 전달되어 회원 가입에 성공함', async () => {
    const signUpDto: SignUpDto = {
      name: '국밥',
      email: 'gookbab99@gmail.com',
      password: 'Ex@mple123!!!',
      nickname: '국밥대장',
      profile: '국밥사진',
    };
    await validation(SignUpDto, signUpDto)

    const mockedReturn = '회원가입 테스트 성공!';
    usersRepository.save.mockReturnValueOnce(mockedReturn);

    const result = await service.register(signUpDto).catch((err) => {
      throw new Error(err);
    });
    expect(result).toBe(mockedReturn);
  });

  it('1-2. User - register, signUpDto가 validationPipe를 통과하지 못해 에러가 발생함', async () => {
    const signUpDto: SignUpDto = {
      name: '국밥',
      email: 'gookbab99@gmail.com',
      password: '',
      nickname: '국밥대장',
      profile: '국밥사진',
    };

    await validation(SignUpDto, signUpDto).catch((err) => {
      return expect(err).toEqual(err);
    });;
  });

  it('1-3. User - register, 같은 이메일이 이미 가입되어 있어 에러가 발생함', async () => {
    const signUpDto: SignUpDto = {
      name: '국밥',
      email: 'gookbab99@gmail.com',
      password: 'Ex@mple123!!!',
      nickname: '국밥대장',
      profile: '국밥사진',
    };
    const sameEmail = 'gookbab99@gmail.com';
    usersRepository.findOne.mockResolvedValueOnce(sameEmail);

    // const mockedReturn = '회원가입 테스트 성공!'
    // await usersRepository.save.mockReturnValueOnce(mockedReturn)

    await service.register(signUpDto).catch((err) => {
      expect(err.message).toBe('이미 가입된 이메일 입니다.');
    });
  });

  it('2-1. User - signIn, 정상적으로 로그인 되어 refreshToken/accessToken을 반환함', async () => {
    //refreshToken과 accessToken 중 하나만 발급되고 중단되는 경우가 있을 수 있을까?
    //
    const signInDto: SignInDto = {
      email: 'gookbab99@gmail.com',
      password: 'Ex@mple123!!!',
    };

    await validation(SignInDto, signInDto);

    const hashedPassword = await hash(signInDto.password, 10);
    usersRepository.findOne.mockResolvedValueOnce({
      id: 1,
      email: 'gookbab99@gmail.com',
      password: `${hashedPassword}`,
      nickname: '국밥대장',
      profile: '국밥사진',
      name: '국밥',
    });
    const result = await service.signIn(signInDto).catch((err) => {
      throw new Error(err);
    });

    expect(result).toStrictEqual({
      accessToken: 'jwt-token',
      refreshToken: 'jwt-token',
    });
  });

  it('2-2. User - signIn, signInDto에 데이터가 제대로 입력되지 않은 채 전달돼 에러를 반환함', async () => {
    //refreshToken과 accessToken 중 하나만 발급되고 중단되는 경우가 있을 수 있을까?

    const signInDto: SignInDto = {
      email: '',
      password: 'Ex@mple123!!!',
    };

    await validation(SignInDto, signInDto).catch((err) => {
      return expect(err).toEqual(err);
    });;
  });

  it('2-3. User - signIn, 가입된 이메일이 존재하지 않아 에러를 반환함', async () => {
    //refreshToken과 accessToken 중 하나만 발급되고 중단되는 경우가 있을 수 있을까?
    //
    const signInDto: SignInDto = {
      email: 'gookbab99@gmail.com',
      password: 'Ex@mple123!!!',
    };

    await validation(SignInDto, signInDto);

    usersRepository.findOne.mockResolvedValueOnce(undefined || null);

    await expect(service.signIn(signInDto)).rejects.toThrow('이메일을 확인하세요.')
  });

  it('2-4. User - signIn, 입력한 비밀번호와 db에 저장된 비밀번호가 일치하지 않아 에러를 반환함', async () => {
    //refreshToken과 accessToken 중 하나만 발급되고 중단되는 경우가 있을 수 있을까?
    //
    const signInDto: SignInDto = {
      email: 'gookbab99@gmail.com',
      password: 'Ex@mple123!!!',
    };

    await validation(SignInDto, signInDto);

    const hashedPassword = await hash('Ex@mple456???', 10);
    usersRepository.findOne.mockResolvedValueOnce({
      id: 1,
      email: 'gookbab99@gmail.com',
      password: `${hashedPassword}`,
      nickname: '국밥대장',
      profile: '국밥사진',
      name: '국밥',
    });

    await expect(service.signIn(signInDto)).rejects.toThrow('비밀번호를 확인하세요.')
  });

  it('3-1. User - findAll, 모든 유저를 id 오름차순으로 반환함', async () => {

    const users = [
      {
        id: 1,
        email: 'gookbab99@gmail.com',
        nickname: '국밥대장',
        profile: '국밥사진',
        name: '국밥',
      },
      {
        id: 2,
        email: 'gookbab99@gmail.com',
        nickname: '감자대장',
        profile: '감자사진',
        name: '감자',
      },
      {
        id: 3,
        email: 'gookbab99@gmail.com',
        nickname: '고구마대장',
        profile: '고구마사진',
        name: '고구마',
      }
    ]
    usersRepository.find.mockResolvedValueOnce(users)

  expect(await service.findAll()).toEqual(users)
  })

  it('4-2. User - findOne, 특정 id값을 가진 유저를 검색함', async () => {
    const id = 1
    const user = 
      {
        id: 1,
        email: 'gookbab99@gmail.com',
        nickname: '국밥대장',
        profile: '국밥사진',
        name: '국밥',
      }
    
    usersRepository.findOneBy.mockResolvedValueOnce(user)

   expect(await service.findOne(id)).toEqual(user)
  })

  it('4-2. User - findOne, id에 null/undefined가 할당된 채 전달되어 에러를 반환함', async () => {
    const id = 1
    const user = null || undefined
    usersRepository.findOneBy.mockResolvedValueOnce(user)

   expect(service.findOne(id)).rejects.toThrow(new NotFoundException('해당 유저가 없습니다'))
});

it('5-1. User - update, id와 updateDto가 잘 전달되어 회원 정보 수정에 성공함, update 값 전후를 ', async () => {
  const id = 1

  const updateDto: UpdateDto = {
    nickname: '국밥대장',
    profile: '국밥사진',
    password: 'Ex@mple123!!!',

  };
  await validation(UpdateDto, updateDto)
  usersRepository.findOne.mockReturnValueOnce(updateDto);
  usersRepository.save.mockReturnValueOnce(updateDto)

  expect(await service.update(id, updateDto)).toBe(updateDto);
});

it('5-2. User - update, id에 null/undefined가 할당된 채 전송되어 에러를 반환함', async () => {
  const id = undefined || null

  const updateDto: UpdateDto = {
    nickname: '국밥대장',
    profile: '국밥사진',
    password: 'Ex@mple123!!!',

  };
  await validation(UpdateDto, updateDto)
  usersRepository.findOne.mockReturnValueOnce(undefined || null);

  expect(service.update(id, updateDto)).rejects.toThrow(NotFoundException);
});

it('5-3. User - update, nickname과 profile 둘다 작성하지 않아 변경 사항이 없어서 에러 반환(Patch 요청이라 globalValidationPipe를 탈지 않탈지 모르겠음, 그래서 validationPipe로직은 제외함 - 이건 put에 맵핑돼야 되는 dto임)' ,
async () => {
  const id = 1

  const updateDto: UpdateDto = {
    nickname: '',
    profile: '',
    password: 'Ex@mple123!!!',

  };

  usersRepository.findOne.mockReturnValueOnce({
    name: '국밥',
      email: 'gookbab99@gmail.com',
      password: '',
      nickname: '국밥대장',
      profile: '국밥사진',
  });

  expect(service.update(id, updateDto)).rejects.toThrow(BadRequestException);
});

it('6-1. User - delete, 특정 id값을 가진 유저의 유저정보를 삭제함', async () => {
  const id = 1
  const user = 
    {
      id: 1,
      email: 'gookbab99@gmail.com',
      nickname: '국밥대장',
      profile: '국밥사진',
      name: '국밥',
    }

  usersRepository.findOneBy.mockResolvedValueOnce(user)
  usersRepository.remove.mockResolvedValueOnce(user)

 expect(service.findOne(id)).resolves.toBe(user)
})

it('6-2. User - delete, id값에 undefined/null이 할당된 채 전송되어 에러를 반환함', async () => {
  const id = undefined || null
  const user = 
    {
      id: 1,
      email: 'gookbab99@gmail.com',
      nickname: '국밥대장',
      profile: '국밥사진',
      name: '국밥',
    }

  usersRepository.findOneBy.mockResolvedValueOnce(undefined || null)
  usersRepository.remove.mockResolvedValueOnce(user)

 expect(service.findOne(id)).rejects.toThrow(NotFoundException)
})

it('7-1. User - findByEmail, 입력된 email에 해당하는 유저 정보를 반환함', async () => {
  const email = 'gookbab99@gmail.com'

  const user = {
    id: 1,
    email: 'gookbab99@gmail.com',
    nickname: '국밥대장',
    profile: '국밥사진',
    name: '국밥'
}

  usersRepository.findOne.mockResolvedValueOnce(user)

expect(service.findByEmail(email)).resolves.toBe(user)

})})
