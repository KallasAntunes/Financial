import { InputData } from '@/interfaces/calculator_input.interface';
import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data: InputData = {
        initialValue: Number(req.query.initialValue),
        monthlyContribution: Number(req.query.monthlyContribution),
        increaseFrequency: Number(req.query.increaseFrequency),
        increaseTotalAmount: Number(req.query.increaseTotalAmount),
        increasePercentage: Number(req.query.increasePercentage),
        desiredTime: Number(req.query.desiredTime),
        profitability: Number(req.query.profitability),
        desiredDividends: Number(req.query.desiredDividends),
      };

      //Validating input data
      const errors: string[] = Object.entries(data).map(([key, value]) => {
        if (Number.isNaN(value)) return `${key} is required`;
      });
      if (errors.length > 0) {
        res.status(300).send(errors);
        return;
      }

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
