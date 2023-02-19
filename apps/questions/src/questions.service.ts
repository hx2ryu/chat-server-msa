import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateQuestionDto } from "./dto";
import { Question } from "./question.entity";

@Injectable()
export class QuestionsService {
    constructor(@InjectRepository(Question) private readonly questionRepo: Repository<Question>) {}

    async createQuestions(question: CreateQuestionDto) {
        const exists = await this.questionRepo.findOneBy(question);
        if (exists) throw new ConflictException("You cannot create this question because there's already question that has same title.");

        const newQuestion = this.questionRepo.create(question);
        try {
            await this.questionRepo.save(newQuestion);
        } catch (error) {
            throw new InternalServerErrorException();
        }
        return newQuestion;
    }

    async getAllQuestions() {
        return this.questionRepo.find();
    }
}
