/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import {
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { HttpResponseException } from './http-exception.interceptor';
import { Request, Response } from 'express';

describe('HttpResponseException', () => {
  let filter: HttpResponseException;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;
  let mockHost: ArgumentsHost;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpResponseException],
    }).compile();

    filter = module.get<HttpResponseException>(HttpResponseException);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      url: '/test-endpoint',
    };

    mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as ArgumentsHost;
  });

  describe('catch', () => {
    it('should handle HttpException with string response', () => {
      const exception = new UnauthorizedException('Access denied');

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Access denied',
          statusCode: HttpStatus.UNAUTHORIZED,
        },
        timestamp: expect.any(String),
        path: '/test-endpoint',
      });
    });

    it('should handle HttpException with object response', () => {
      const exception = new BadRequestException({
        message: 'Validation failed',
        error: 'Bad Request',
      });

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Validation failed',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        timestamp: expect.any(String),
        path: '/test-endpoint',
      });
    });

    it('should handle HttpException with custom status code', () => {
      const exception = new HttpException('Custom error', HttpStatus.CONFLICT);

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Custom error',
          statusCode: HttpStatus.CONFLICT,
        },
        timestamp: expect.any(String),
        path: '/test-endpoint',
      });
    });

    it('should handle Error instances', () => {
      const exception = new Error('Database connection failed');

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Database connection failed',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        timestamp: expect.any(String),
        path: '/test-endpoint',
      });
    });

    it('should handle unknown exceptions', () => {
      const exception = 'Unknown error string';

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        timestamp: expect.any(String),
        path: '/test-endpoint',
      });
    });

    it('should handle null exceptions', () => {
      filter.catch(null, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        timestamp: expect.any(String),
        path: '/test-endpoint',
      });
    });

    it('should handle undefined exceptions', () => {
      filter.catch(undefined, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        timestamp: expect.any(String),
        path: '/test-endpoint',
      });
    });

    it('should handle HttpException with complex object response', () => {
      const exception = new HttpException(
        {
          message: 'Complex error',
          details: ['detail1', 'detail2'],
          code: 'VALIDATION_ERROR',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Complex error',
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        },
        timestamp: expect.any(String),
        path: '/test-endpoint',
      });
    });

    it('should handle HttpException with response object without message property', () => {
      const exception = new HttpException(
        {
          error: 'Some error',
          code: 123,
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Internal server error',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        timestamp: expect.any(String),
        path: '/test-endpoint',
      });
    });

    it('should include correct request path in response', () => {
      mockRequest.url = '/api/v1/users/profile';
      const exception = new Error('Test error');

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/api/v1/users/profile',
        }),
      );
    });
  });
});
