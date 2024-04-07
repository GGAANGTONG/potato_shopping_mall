import { Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    // 유저 결제 목록 전체 조회
    @UseGuards(AuthGuard('jwt'))
    @Get('user')
    async findAllOrderByUser(@Req() req) {
        const userId = req.user.id; // 현재 로그인한 사용자의 ID
        return this.paymentsService.findAllOrderbyUser(userId);
    }

    // 결제 정보 전체 조회
    @UseGuards(AuthGuard('jwt'))
    @Get('admin')
    async findAllOrderByAdmin() {
        return this.paymentsService.findAllOrderbyAdmin();
    }

    // 결제 정보 상세 조회
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async findOneOrderByBoth(@Param('id', ParseIntPipe) id: number) {
        return this.paymentsService.findOneOrderbyBoth(id);
    }

    // 결제 취소
    @UseGuards(AuthGuard('jwt'))
    @Post(':paymentsId/cancel')
    async cancelPay(@Req() req, @Param('paymentsId') paymentsId: number) {
        try {
            // 결제 취소 로직을 서비스에서 호출하여 실행.
            const userId = req.user.id
            const cancelledPay = await this.paymentsService.cancelPay(userId, paymentsId);
            return { message: '결제가 취소되었습니다.', payments: cancelledPay };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                throw new NotFoundException('결제를 취소할 수 없습니다.'); // 그 외의 오류는 일반적인 오류 메시지를 반환.
            }
        }
    }
}