<template>
  <div>
    <link
      rel="icon"
      href="https://static.toss.im/icons/png/4x/icon-toss-logo.png"
    />
    <link
      rel="stylesheet"
      type="text/css"
      href="../assets/css/style.toss.css"
    />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>토스페이먼츠 샘플 프로젝트</title>
  </div>
  <div class="toss-place">
    <!-- 주문서 영역 -->
    <div class="wrapper">
      <div
        class="box_section"
        style="
          padding: 40px 30px 50px 30px;
          margin-top: 0 !important; margin-bottom: 0 !important;
        "
      >
        <!-- 결제 UI -->
        <div id="payment-method"></div>
        <!-- 이용약관 UI -->
        <div id="agreement"></div>
        <!-- 쿠폰 체크박스 -->
        <div style="padding-left: 25px">
          <div class="checkable typography--p">
            <label for="coupon-box" class="checkable__label typography--regular"
              ><input
                id="coupon-box"
                class="checkable__input"
                type="checkbox"
                aria-checked="true"
                disabled
              /><span class="checkable__label-text"
                >5,000원 쿠폰 적용</span
              ></label
            >
          </div>
        </div>
        <!-- 결제하기 버튼 -->
        <button
          class="button"
          id="payment-button"
          style="margin-top: 30px"
          disabled
        >
          결제하기
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';

export default {
  name: 'PayCashValidation',
  mounted() {
    this.loadScript();
  },
  methods: {
    loadScript() {
      let script = document.createElement('script');
      script.src = 'https://js.tosspayments.com/v1/payment-widget';
      script.onload = () => this.PayCashValidation();
      document.body.appendChild(script);
    },
    async PayCashValidation() {
      const generateRandomString = () =>
        window.btoa(Math.random()).slice(0, 20);

      const button = document.getElementById('payment-button');
      const coupon = document.getElementById('coupon-box');

      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);

      var orderId = urlParams.get('orderId');
      var orderName = urlParams.get('orderName');
      var amount = urlParams.get('amount');

      const clientKey = 'test_ck_DpexMgkW36wy75dojXq4VGbR5ozO';
      const customerKey = generateRandomString();

      const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

      // ------  결제 UI 렌더링 ------
      // @docs https://docs.tosspayments.com/reference/widget-sdk#renderpaymentmethods선택자-결제-금액-옵션
      const paymentMethodWidget = await paymentWidget.renderPaymentMethods(
        '#payment-method',
        { value: amount },

        { variantKey: 'DEFAULT' },
      );

      // ------  이용약관 UI 렌더링 ------
      await paymentWidget.renderAgreement('#agreement', {
        variantKey: 'AGREEMENT',
      });

      //  ------  결제 UI 렌더링 완료 이벤트 ------
      await paymentMethodWidget.on('ready', function () {
        button.disabled = false;
        coupon.disabled = false;
      });

      // ------  결제 금액 업데이트 ------
      coupon.addEventListener('change', async function () {
        if (coupon.checked) {
          await paymentMethodWidget.updateAmount(amount - 5000);
        } else {
          await paymentMethodWidget.updateAmount(amount);
        }
      });
      console.log('인터넷 국밥1', amount);
      console.log('인터넷 국밥2', orderId);
      console.log('인터넷 국밥3', orderName);
      // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
      button.addEventListener('click', async function () {
        await paymentWidget.requestPayment({
          orderId: `${orderId}`,
          orderName: `${orderName}`,
          successUrl: process.env.VUE_APP_API_URL+'/payments/payCashValidationSuccess',
          failUrl: process.env.VUE_APP_API_URL+'/api/fail',
        });
      });
    },
  },
};
</script>
<style>
@import '../assets/css/style.toss.css';
.toss-place {
  background-image: url('https://static.toss.im/ml-illust/img-back_005.jpg');
  background-color: #e8f3ff;
  padding: 20px;
  box-sizing: border-box;
}
</style>
