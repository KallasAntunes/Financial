import { InputData } from '@/interfaces/calculator_input.interface';
import IndexService from '@/services/index.service';
import { NextFunction, Request, Response } from 'express';

class IndexController {

  private service: IndexService;

  constructor() {
    this.service = new IndexService();
  }

  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      //Defining our variables
      const data: InputData = {
        initialValue: Number(req.query.initialValue),
        monthlyContribution: Number(req.query.monthlyContribution),
        increaseFrequencyMonths: Number(req.query.increaseFrequencyMonths),
        increaseTotalAmount: Number(req.query.increaseTotalAmount),
        increasePercentage: Number(req.query.increasePercentage),
        desiredTime: Number(req.query.desiredTime),
        profitability: Number(req.query.profitability),
        desiredDividends: Number(req.query.desiredDividends),
      };
      let usePercentage: boolean = false;
      let hasPredefinedTime: boolean = false;

      //Validating input data
      const errors: string[] = [];
      if (Number.isNaN(data.initialValue)) errors.push('The field initialValue is required');
      if (Number.isNaN(data.monthlyContribution)) errors.push('The field monthlyContribution is required');
      if (Number.isNaN(data.profitability)) errors.push('The field profitability is required');

      //Deciding if we should use percentage or totalAmount
      if ([Number.isNaN(data.increaseTotalAmount), Number.isNaN(data.increasePercentage)].filter(Boolean).length === 1) {
        if (Number.isNaN(data.increaseTotalAmount)) usePercentage = true;
      } else errors.push('Please provide either increaseTotalAmount or increasePercentage');

      //Deciding which function to use
      if ([Number.isNaN(data.desiredTime), Number.isNaN(data.desiredDividends)].filter(Boolean).length === 1) {
        if (Number.isNaN(data.desiredDividends)) hasPredefinedTime = true;
      } else errors.push('Please provide either desiredTime or desiredDividends');

      //Sending errors if any
      if (errors.length > 0) {
        res.status(300).send(errors);
        return;
      }

      //Calculating and sending user the result
      const result = this.service.calculate(data, usePercentage, hasPredefinedTime);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

}

export default IndexController;
