import { Module } from '@nestjs/common';
import { SuggestionsController } from './suggestions.controller';
import { SuggestionsService } from './suggestions.service';
import { Suggestion } from './suggestion.entity';
import { Category } from 'src/categories/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Suggestion, Category])],
  controllers: [SuggestionsController],
  providers: [SuggestionsService, JwtStrategy]
})
export class SuggestionsModule {}
