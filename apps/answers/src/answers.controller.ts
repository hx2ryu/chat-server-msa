import { Controller } from "@nestjs/common";
import { EventPattern, MessagePattern } from "@nestjs/microservices";
import { AnswersService } from "./answers.service";
import { CreateAnswerDto } from "./dto";

@Controller()
export class AnswersController {
    constructor(private readonly answerService: AnswersService) {}

    @EventPattern("answer_created")
    createAnswers(answer: CreateAnswerDto) {
        return this.answerService.createAnswers(answer);
    }

    @MessagePattern({ cmd: "get-all-answers" })
    getAllAnswers(data: any) {
        return this.answerService.getAllAnswers(data.id);
    }
}
