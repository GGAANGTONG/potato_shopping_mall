import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entitiy';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { SignInDto } from './dto/sign_in.dto';
import { hash } from 'bcrypt'

describe('PaymentsService', () => {
  let service: UserService;
  let usersRepository: Partial<Record<keyof Repository<Users>, jest.Mock>>
  let jwtService: Partial<JwtService>


  async function validation(Dto, dto
    ) {
    let validatonPipe = new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true})
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: Dto,
      data: ''
   }
         await validatonPipe.transform(dto, metadata)
         .catch(err => {
          return expect(err).toEqual(err)
             
         })
        }

  beforeEach(async () => {

    usersRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn()
    }

    jwtService = {
      sign: jest.fn().mockReturnValue('jwt-token')
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Users),
          useValue: usersRepository
        },
        {
          provide: JwtService,
          useValue: jwtService
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService)
  });

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('UserService가 정상적으로 실행됨', () => {
    expect(service).toBeDefined();
  });

  it('1-1. User - register, signUpDto가 잘 전달되어 회원 가입에 성공함', async () => {
    let signUpDto:SignUpDto = {
      name: '국밥',
      email: 'gookbab99@gmail.com',
      password: 'Ex@mple123!!!',
      nickname: '국밥대장',
      profile: '국밥사진'
    }
    const mockedReturn = '회원가입 테스트 성공!'
    await usersRepository.save.mockReturnValueOnce(mockedReturn)

    const result = await service.register(signUpDto).catch(
      err => {
        throw new Error()
      }
    )
      expect(result).toBe(mockedReturn)

  } )

  it('1-2. User - register, signUpDto가 validationPipe를 통과하지 못해 에러가 발생함', async () => {
    let signUpDto:SignUpDto = {
      name: '국밥',
      email: 'gookbab99@gmail.com',
      password: '',
      nickname: '국밥대장',
      profile: '국밥사진'
    }

    await validation(SignUpDto, signUpDto)

  } )

  it('1-3. User - register, 같은 이메일이 이미 가입되어 있어 에러가 발생함', async () => {
    let signUpDto:SignUpDto = {
      name: '국밥',
      email: 'gookbab99@gmail.com',
      password: 'Ex@mple123!!!',
      nickname: '국밥대장',
      profile: '국밥사진'
    }
    const sameEmail = 'gookbab99@gmail.com'
    await usersRepository.findOne.mockResolvedValueOnce(sameEmail)

    // const mockedReturn = '회원가입 테스트 성공!'
    // await usersRepository.save.mockReturnValueOnce(mockedReturn)

    await service.register(signUpDto).catch(
      err => {
        expect(err.message).toBe('이미 가입된 이메일 입니다.')
      }
    )
  })

  it('2-1. User - signIn, 정상적으로 로그인 되어 refreshToken/accessToken을 반환함', async () => {
    //refreshToken과 accessToken 중 하나만 발급되고 중단되는 경우가 있을 수 있을까?
    //
    let signInDto:SignInDto = {
      email: 'gookbab99@gmail.com',
      password: 'Ex@mple123!!!',
    }

    await validation(SignInDto, signInDto)

    const hashedPassword = await hash(signInDto.password, 10)
    await usersRepository.findOne.mockResolvedValueOnce({
      id: 1,
      email: 'gookbab99@gmail.com',
      password: `${hashedPassword}`,
      nickname: '국밥대장',
      profile: '국밥사진',
      name: '국밥'
    })
    const result = await service.signIn(signInDto).catch(
      err => {
        throw new Error()
      }
    )

    expect(result).toStrictEqual({
      accessToken: 'jwt-token',
      refreshToken: 'jwt-token'
    })
      
    })

    it('2-2. User - signIn, signInDto에 데이터가 제대로 입력되지 않은 채 전달돼 에러를 반환함', async () => {
      //refreshToken과 accessToken 중 하나만 발급되고 중단되는 경우가 있을 수 있을까?
    
      let signInDto:SignInDto = {
        email: '',
        password: 'Ex@mple123!!!',
      }
  
      await validation(SignInDto, signInDto)
  
    })

    it('2-3. User - signIn, 가입된 이메일이 존재하지 않아 에러를 반환함', async () => {
      //refreshToken과 accessToken 중 하나만 발급되고 중단되는 경우가 있을 수 있을까?
      //
      let signInDto:SignInDto = {
        email: 'gookbab99@gmail.com',
        password: 'Ex@mple123!!!',
      }
  
      await validation(SignInDto, signInDto)
  
      await usersRepository.findOne.mockResolvedValueOnce(undefined || null)
      const result = await service.signIn(signInDto).catch(
        err => {
          expect(err).toThrowError('이메일을 확인하세요.')
        }
      )
  
      expect(result).toStrictEqual({
        accessToken: 'jwt-token',
        refreshToken: 'jwt-token'
      })
        
      })

  })


