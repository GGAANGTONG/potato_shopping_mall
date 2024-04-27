import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import _ from 'lodash';
import { Storage } from 'src/storage/entities/storage.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KakaoGeocoder {
    private readonly KAKAO_API_KEY = process.env.KAKAO_REST_API_KEY;
    private readonly baseUrl = `https://dapi.kakao.com/v2/local/search/address`;
    constructor(
       @InjectRepository(Storage) private readonly storageRepository: Repository<Storage>
    ) {}



    async getCoordinates(address: string): Promise<{ lat: number, lng: number }> {
        try {

            const response = await axios.get(this.baseUrl, {
                headers: {
                    'Authorization': `KakaoAK ${this.KAKAO_API_KEY}`
                },
                params: {
                    query: address
                }
            }).catch(error => {
                // console.error('Kakao API 호출 중 문제가 발생했습니다:', error);
                throw new InternalServerErrorException('Kakao API 호출 중 문제가 발생했습니다.');
            });

            if (response.data.documents && response.data.documents.length > 0) {
                const { x: lng, y: lat } = response.data.documents[0];
                return { lat: parseFloat(lat), lng: parseFloat(lng) };
            } else {
                throw new NotFoundException('결과가 없습니다.');
            }
        } catch (error) {
            // console.error('좌표값 찾기 실패:', error);
            throw new InternalServerErrorException('Kakao API 호출 중 문제가 발생했습니다.');
        }
    }

    private readonly baseUrlDelivery = 'https://apis-navi.kakaomobility.com/v1/future/directions'

    //결제 완료 시점에 가장 가까운 창고를 검색하고 => 재고를 검색하고 => 재고 있으면 여기서 까고 => 재고 없으면 그 창고랑 가장 가까운 창고에서 까고 + 소비자랑 가까운 창고에 재고를 잠시 추가했다가, 거기서 까는 거죠 
    //입출고 기록 어떻게 남길 수 있을까? 
    async getClosestStorage(destination) {
        //storage에는 x(longitude),y(latitude) 좌표있음
        const {lng: x, lat: y} = destination
        if(_.isNil(x) || _.isNil(y)) {
            throw new BadRequestException('좌표를 다시 입력해 주세요.')
        }
        try{
            const currentDate = new Date()
            currentDate.setDate(currentDate.getDate() + 1)
            const deliveryDate = currentDate.toISOString().slice(0, 16).replace(/[-T:]/g, '');
            const storages = await this.storageRepository.find()

            const list = [];
            for(let i = 0; i < storages.length; i++) {
            const data = await axios.get(this.baseUrlDelivery, {
                headers: {
                    'Authorization': `KakaoAK ${this.KAKAO_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    departure_time: deliveryDate,
                    origin: `${storages[i].longitude}, ${storages[i].latitude}`,
                    destination: `${x}, ${y}`,
                    priority: 'DISTANCE',
                    avoid: null,
                    roadevent: 0
                }
            }).catch(error => {
                console.error('Kakao API 호출 중 문제가 발생했습니다:', error);
                throw new InternalServerErrorException('Kakao API 호출 중 문제가 발생했습니다.');
            })
            if(_.isNil(data)) {
                continue;
            }
            //섬 같이 아예 연결이 안된 곳은 거리 계산 자체가 불가함, api가 멈춰버림
            const distance = data.data.routes[0].summary.distance
            console.log('국바압 ><', distance)

           if(!_.isNil(distance)) {
            list.push({id: storages[i].id,
                distance: data.data.routes[0].summary.distance
            })
            console.log('국밥명단', list)
        }
        }
        console.log('국바압?', list)
      const result = list.reduce((acc, curr) => {
           return acc.distance > curr.distance ? curr : acc
        })
        console.log('국바압!', result)
        return storages[result.id]
    } catch(error) {
        // console.error('좌표값 찾기 실패:', error);
        throw new InternalServerErrorException('Kakao API 호출 중 문제가 발생했습니다.');
    }
    }
}
