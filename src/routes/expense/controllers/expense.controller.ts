import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { DEFAULT_SUCCESS_MESSAGE, HttpStatus, SuccessResponse } from 'src/shared/helpers/response';
import { ExpenseService } from '../expense.service';
import { CreateExpenseBodyDTO, GetExpensesQueryDTO, GetExpensesQueryPaginationDTO, UpdateExpenseBodyDTO } from '../expense.dto';

@SkipThrottle()
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get()
  async list(@Query() query: GetExpensesQueryDTO) {
    const response = await this.expenseService.list(query);
    return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
  }

  @Get('project/:projectId')
  async getByProject(@Param('projectId', ParseIntPipe) projectId: number, @Query() query: GetExpensesQueryPaginationDTO) {
    const response = await this.expenseService.getExpensesByProject(projectId, query);
    return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
  }

  @Get('project/:projectId/summary')
  async getProjectExpenseSummary(@Param('projectId', ParseIntPipe) projectId: number) {
    const response = await this.expenseService.getProjectExpenseSummary(projectId);
    return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const response = await this.expenseService.getById(id);
    return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
  }

  @Post()
  async create(@Body() body: CreateExpenseBodyDTO) {
    const response = await this.expenseService.create(body);
    return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.CREATED);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateExpenseBodyDTO) {
    const response = await this.expenseService.update(id, body);
    return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const response = await this.expenseService.delete(id);
    return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
  }
}
