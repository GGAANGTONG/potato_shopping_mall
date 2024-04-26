import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

export interface TrackingDetail {
    kind: string;
    where: string;
    timeString: string;
}

export interface TrackingType {
    trackingDetails: TrackingDetail[];
}

export const getAllCompanyList = async () => {
    const API_KEY = "yMJUCRNpvG3iFE1usvNB3w"
    try {
        const deliveryCompany = `${process.env.BASE_URL}/companylist?t_key=${API_KEY}`;
        const response = await fetch(deliveryCompany);
        const json = await response.json();
        console.log('!!!!!!', json)
        return json;
    } catch (error) {
        console.error(error);
        throw new Error('택배사 데이터를 불러오는 중에 오류가 발생했습니다.');
    }
};

export const getDeliveryInqResult = async (

    invoice: string
): Promise<TrackingType> => {
    try {
        if (!invoice) {
            throw new Error('송장번호를 입력해야 합니다.');
        }
        const API_KEY = "yMJUCRNpvG3iFE1usvNB3w"
        const companyCode = '04';
        const trackingInfoUrl = `${process.env.BASE_URL}/trackingInfo?t_code=${companyCode}&t_invoice=${invoice}&t_key=${API_KEY}`;
        const response = await fetch(trackingInfoUrl);
        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.msg || '배송 조회에 실패했습니다.');
        }
        console.log(json);
        return json;
    } catch (error) {
        console.error(error);
        throw new Error('배송 조회 중에 오류가 발생했습니다.');
    }
};

// export default { getDeliveryInqResult }

