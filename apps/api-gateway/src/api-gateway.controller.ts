import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateAnswerDto, CreateQuestionDto } from "./dto";

@Controller("/questions")
export class ApiGatewayController {
    constructor(@Inject("QUESTIONS_SERVICE") private questionClient: ClientProxy, @Inject("ANSWERS_SERVICE") private answerClient: ClientProxy) {}

    @Post()
    async createQuestions(@Body() createQuestionDto: CreateQuestionDto) {
        return this.questionClient.emit("question_created", createQuestionDto);
    }

    @Get()
    async getQuestions() {
        return this.questionClient.send({ cmd: "get-all-questions" }, "");
    }

    @Post("/:questionId/answers")
    async createAnswer(@Body() createAnswer: CreateAnswerDto, @Param("questionId", ParseIntPipe) questionId: number) {
        return this.answerClient.emit("answer_created", { ...createAnswer, questionId });
    }

    @Get("/:questionId/answers")
    async getAnswers(@Param("questionId", ParseIntPipe) questionId: number) {
        return this.answerClient.send({ cmd: "get-all-answers" }, { questionId });
    }
}
