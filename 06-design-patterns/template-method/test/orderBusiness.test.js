import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import OrderBusiness from "../src/business/orderBusiness.js";
import Order from "../src/entities/order.js";

describe("Test suite for Template method design pattern", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  describe("#OrderBusiness", () => {
    test("Execution OrderBusiness without Template Method", () => {
      const order = new Order({
        customerId: 1,
        amount: 1000,
        products: [{ description: "Fusca" }],
      });
      const orderBusiness = new OrderBusiness();
      const isValid = orderBusiness._validateRequiredFields(order);
      expect(isValid).toBeTruthy();

      const result = orderBusiness._create(order);
      expect(result).toBeTruthy();
    });
    test("Execution OrderBusiness with Template Method", () => {
      const order = new Order({
        customerId: 1,
        amount: 1000,
        products: [{ description: "Fusca" }],
      });
      const orderBusiness = new OrderBusiness();
      const calledValidationFn = jest.spyOn(
        orderBusiness,
        orderBusiness._validateRequiredFields.name
      );
      const calledCreateFn = jest.spyOn(orderBusiness, orderBusiness._create.name);

      const result = orderBusiness.create(order);
      expect(result).toBeTruthy();
      expect(calledValidationFn).toHaveBeenCalled();
      expect(calledCreateFn).toHaveBeenCalled();
    });
  });
});
