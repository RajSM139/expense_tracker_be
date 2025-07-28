/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { ResponseInterceptor } from './http-response.interceptor';
import { of } from 'rxjs';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;
  let mockContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseInterceptor],
    }).compile();

    interceptor = module.get<ResponseInterceptor<any>>(ResponseInterceptor);

    mockContext = {} as ExecutionContext;
  });

  describe('intercept', () => {
    it('should transform response with success flag, data, and timestamp', (done) => {
      const testData = { message: 'Hello World' };
      mockCallHandler = {
        handle: () => of(testData),
      };

      interceptor.intercept(mockContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toHaveProperty('success', true);
          expect(result).toHaveProperty('data', testData);
          expect(result).toHaveProperty('timestamp');
          expect(typeof (result as any).timestamp).toBe('string');
          expect(new Date((result as any).timestamp).getTime()).not.toBeNaN();
          done();
        },
        error: done,
      });
    });

    it('should handle null data', (done) => {
      mockCallHandler = {
        handle: () => of(null),
      };

      interceptor.intercept(mockContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toHaveProperty('success', true);
          expect(result).toHaveProperty('data', null);
          expect(result).toHaveProperty('timestamp');
          done();
        },
        error: done,
      });
    });

    it('should handle undefined data', (done) => {
      mockCallHandler = {
        handle: () => of(undefined),
      };

      interceptor.intercept(mockContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toHaveProperty('success', true);
          expect(result).toHaveProperty('data', undefined);
          expect(result).toHaveProperty('timestamp');
          done();
        },
        error: done,
      });
    });

    it('should handle array data', (done) => {
      const testData = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];
      mockCallHandler = {
        handle: () => of(testData),
      };

      interceptor.intercept(mockContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toHaveProperty('success', true);
          expect(result).toHaveProperty('data', testData);
          expect(result).toHaveProperty('timestamp');
          done();
        },
        error: done,
      });
    });

    it('should handle primitive data types', (done) => {
      const testData = 'Simple string response';
      mockCallHandler = {
        handle: () => of(testData),
      };

      interceptor.intercept(mockContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toHaveProperty('success', true);
          expect(result).toHaveProperty('data', testData);
          expect(result).toHaveProperty('timestamp');
          done();
        },
        error: done,
      });
    });

    it('should handle number data', (done) => {
      const testData = 42;
      mockCallHandler = {
        handle: () => of(testData),
      };

      interceptor.intercept(mockContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toHaveProperty('success', true);
          expect(result).toHaveProperty('data', testData);
          expect(result).toHaveProperty('timestamp');
          done();
        },
        error: done,
      });
    });

    it('should maintain response structure consistency', (done) => {
      const testData = { user: { id: 1, name: 'John' } };
      mockCallHandler = {
        handle: () => of(testData),
      };

      interceptor.intercept(mockContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual({
            success: true,
            data: testData,
            timestamp: expect.any(String),
          });
          done();
        },
        error: done,
      });
    });
  });
});
