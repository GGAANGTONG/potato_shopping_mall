import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface kakaoTokenResponse { accessToken:string} 
@Injectable()
export class OauthService {
  constructor(
    private http: HttpService,
  ) {}



    //카카오

    async kakaoLogin(
      KAKAO_REST_API_KEY: string,
      KAKAO_REDIRECT_URI: string,
      code: string,
    ) {
      const config = {
        grant_type: 'authorization_code',
        client_id: KAKAO_REST_API_KEY,
        redirect_uri: KAKAO_REDIRECT_URI,
        code,
      };
      const params = new URLSearchParams(config).toString();
      const tokenHeaders = {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      };
      const tokenUrl = `https://kauth.kakao.com/oauth/token?${params}`;
  
      const tokenRes = await firstValueFrom(
        this.http.post(tokenUrl, '', { headers: tokenHeaders }),
      );
  
      // 'any' 타입으로 응답을 단언하여 'access_token'에 접근
      const accessToken = (tokenRes as any).data.access_token;
  
      // accessToken을 사용하여 사용자 정보를 가져오는 부분
      const userInfoUrl = `https://kapi.kakao.com/v2/user/me`;
      const userInfoHeaders = {
        Authorization: `Bearer ${accessToken}`,
      };
  
      // 사용자 정보 요청 및 응답 처리
      const userInfoRes = await firstValueFrom(
        this.http.get(userInfoUrl, { headers: userInfoHeaders }),
      );
      console.log(userInfoRes);
      
      // const data = userInfoRes.data;
      // // 사용자 정보를 로컬 DB에 저장
      // let user = await this.usersRepository.findOne({
      //   where: { email: data.email },
      // });
      // if (!user) {
      //   user = new Users();
      //   user.email = data.kakao_account.email;
      //   user.nickname = data.properties.nickname;
      //   // 기타 필요한 정보 추가 가능
      //   await this.usersRepository.save(user);
      // }
      // return user;

      //any type 줄이기 

}}
