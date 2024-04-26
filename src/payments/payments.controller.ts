import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { AuthGuard } from "@nestjs/passport";
import { CreatePaymentDto } from "../orders/dto/create-payment.dto";
import logger from "src/common/log/logger";
import { Response } from 'express';
import _ from "lodash";


@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }
    //포인트 결제
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async pay(@Req() req, @Body() createPaymentDto: CreatePaymentDto) {
        const userId = req.user.id;
        logger.traceLogger(`Payments - pay`, `req.user = ${JSON.stringify(req.user)}, createPaymentDto = ${JSON.stringify(createPaymentDto)}`)
        return await this.paymentsService.pay(userId, createPaymentDto);
    }
    //토스페이 - 결제 인증 요청
    //check.html로 렌더링
    //렌더링 시 orderName, orderId, amount(o_total_price) 같이 가야 함
    @UseGuards(AuthGuard('jwt'))
    @Post()
   async payCash (@Req() req, @Body() createPaymentDto: CreatePaymentDto, @Res() res) {
    const userId = req.user.id;
    logger.traceLogger(`Payments - payCash`, `req.user = ${JSON.stringify(req.user)}, createPaymentDto = ${JSON.stringify(createPaymentDto)}`)
    const data = await this.paymentsService.payCash(userId, createPaymentDto)
    return res.render('checkout.html', {
        orderName: data.message,
        orderId: data.data.toss_orders_id,
        amount: data.data.o_total_price
    })
   }
   //토스페이 결제 승인 요청
   @Post('payCash-confirm')
   async payCashConfirm(@Body() requestData, @Res() res) {
    const {paymentKey, orderId, amount} = requestData

    if(_.isNil(paymentKey) || paymentKey == 0 || _.isNil(orderId) || orderId == 0 || _.isNil(amount)) {
        throw new BadRequestException('잘못된 요청입니다!')
    }

    const data = await this.paymentsService.payCashConfirm(requestData)

    return res.status(200).json({
        message: '결제 준비가 완료되었습니다.' 
    })
   }

    // 유저 결제 목록 전체 조회
    @UseGuards(AuthGuard('jwt'))
    @Get('user')
    async findAllOrderByUser(@Req() req) {
        const userId = req.user.id; // 현재 로그인한 사용자의 ID
        logger.traceLogger('Payments - findAllOrderByUser', `req.user = ${JSON.stringify(req.user)}`)
        return this.paymentsService.findAllOrderbyUser(userId);
    }

    // 결제 정보 전체 조회
    @UseGuards(AuthGuard('jwt'))
    @Get('admin')
    async findAllOrderByAdmin() {
        logger.traceLogger('Payments - findAllOrderByAdmin', `parameter = none`)
        return this.paymentsService.findAllOrderbyAdmin();
    }

    // 결제 정보 상세 조회
    @UseGuards(AuthGuard('jwt'))
    @Get('get-one/:id')
    async findOneOrderByBoth(@Param('id', ParseIntPipe) id: number) {
        logger.traceLogger('Payments - findOneOrderByBoth', `id = ${id}`)
        return this.paymentsService.findOneOrderbyBoth(id);
    }

    // 결제 취소
    @UseGuards(AuthGuard('jwt'))
    @Post(':paymentsId/cancel')
    async cancelPay(@Req() req, @Param('paymentsId') paymentsId: number) {
        try {
            // 결제 취소 로직을 서비스에서 호출하여 실행.
            const userId = req.user.id

            logger.traceLogger(`Payments - cancelPay`, `req.user = ${JSON.stringify(req.user)}, paymentsId = ${paymentsId}`)
            const cancelledPay = await this.paymentsService.cancelPay(userId, paymentsId);

            return { message: '결제가 취소되었습니다.', payments: cancelledPay };
        } catch (error) {
            console.error(error)
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                const fatalError = new NotFoundException('알 수 없는 에러가 발생하여 결제를 취소할 수 없습니다.');
                logger.fatalLogger(fatalError, `req.user = ${JSON.stringify(req.user)}, paymentsId = ${paymentsId}`)
                throw fatalError// 그 외의 오류는 일반적인 오류 메시지를 반환.
            }
        }
    }

    @Get('/find-location')
    async findLocation(@Query('address') address: string, @Res() res: Response) {
        if (!address) {
            throw new HttpException('배송지를 입력하세요.', HttpStatus.BAD_REQUEST);
        }

        try {
        const coordinates = await this.paymentsService.getCoordinates(address);
        res.status(HttpStatus.OK).json({
            message: '좌표 반환 완료',
            data: coordinates
        });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}