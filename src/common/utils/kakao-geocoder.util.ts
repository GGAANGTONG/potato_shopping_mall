import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class KakaoGeocoder {
    private readonly KAKAO_API_KEY = process.env.KAKAO_REST_API_KEY;
    private readonly baseUrl = `https://dapi.kakao.com/v2/local/search/address`;

    async getCoordinates(address: string): Promise<{ lat: number, lng: number }> {
        try {
            const response = await axios.get(this.baseUrl, {
                headers: {
                    'Authorization': `KakaoAK ${this.KAKAO_API_KEY}`
                },
                params: {
                    query: address
                }
            });

            if (response.data.documents && response.data.documents.length > 0) {
                const { x: lng, y: lat } = response.data.documents[0];
                return { lat: parseFloat(lat), lng: parseFloat(lng) };
            } else {
                throw new NotFoundException('결과가 없습니다.');
            }
        } catch (error) {
            console.error('좌표값 찾기 실패:', error);
            throw new InternalServerErrorException('Kakao API 호출 중 문제가 발생했습니다.');
        }
    }
}
