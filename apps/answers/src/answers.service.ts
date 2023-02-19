import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Answer } from "./answer.entity";
import { CreateAnswerDto } from "./dto";

@Injectable()
export class AnswersService {
    constructor(@InjectRepository(Answer) private readonly answerRepo: Repository<Answer>) {}

    async createAnswers(answer: CreateAnswerDto) {
        const exists = await this.answerRepo.findOneBy(answer);
        if (exists) throw new ConflictException("You cannot create this answer because there's already answer that has same title.");

        const newAnswer = this.answerRepo.create(answer);
        try {
            await this.answerRepo.save(newAnswer);
        } catch (error) {
            throw new InternalServerErrorException();
        }
        return newAnswer;
    }

    async getAllAnswers(id: number) {
        const found = await this.answerRepo.find({ where: { questionId: id } });
        return found;
    }
}
