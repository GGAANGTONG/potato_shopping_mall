const API_KEY = "yMJUCRNpvG3iFE1usvNB3w"
const BASE_URL = "http://info.sweettracker.co.kr/api/v1"

// 택배사 모든 데이터 불러오기
export const getAllCompanyList = async () => {
    const deliveryCompany = `${BASE_URL}/companylist?t_key=${API_KEY}`;
    const data = await fetch(deliveryCompany);
    const _json = await data.json();
    return _json;
};

export interface TrackingType {
    trackingDetails: {
        kind: string;
        where: string;
        timeString: string;
    }[];
}

// 배송조회 결과
export const getDeliveryInqResult = async (
    companyCode: string,
    invoice: string
): Promise<TrackingType> => {
    if (companyCode === "") {
        throw new Error("택배사를 선택 해주셔야 합니다.");
    }

    const data = await fetch(
        `${BASE_URL}/trackingInfo?t_code=${companyCode}&t_invoice=${invoice}&t_key=${API_KEY}`
    );
    const _json = await data.json();

    if (_json.status === false) {
        throw new Error(_json.msg);
    }

    return _json;
};