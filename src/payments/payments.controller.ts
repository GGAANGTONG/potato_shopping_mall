import { Controller, Get, Param, ParseIntPipe, Req, UseGuards } from "@nestjs/common";
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
}