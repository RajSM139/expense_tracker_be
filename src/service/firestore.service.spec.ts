/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { FirestoreService } from './firestore.service';
import { FIREBASE_ADMIN } from '../firebase-admin-init';

const mockFirestore = {
  collection: jest.fn(),
  settings: jest.fn(),
};

const mockAdmin = {
  firestore: () => mockFirestore,
};

describe('FirestoreService', () => {
  let service: FirestoreService;
  let collectionMock: any;

  beforeEach(async () => {
    collectionMock = {
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn(),
    };
    mockFirestore.collection.mockReturnValue(collectionMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FirestoreService,
        { provide: FIREBASE_ADMIN, useValue: mockAdmin },
      ],
    }).compile();

    service = module.get(FirestoreService);
  });

  describe('getDocument', () => {
    it('should return null if no document is found', async () => {
      collectionMock.get.mockResolvedValue({ empty: true });
      const result = await service.getDocument('users', 'abc123');
      expect(result).toBeNull();
      expect(mockFirestore.collection).toHaveBeenCalledWith('users');
      expect(collectionMock.where).toHaveBeenCalledWith(
        'userId',
        '==',
        'abc123',
      );
      expect(collectionMock.limit).toHaveBeenCalledWith(1);
      expect(collectionMock.get).toHaveBeenCalled();
    });

    it('should return document data if found', async () => {
      const docData = { userId: 'abc123', name: 'Test User' };
      const docMock = { id: 'docid', data: () => docData };
      collectionMock.get.mockResolvedValue({ empty: false, docs: [docMock] });
      const result = await service.getDocument('users', 'abc123');
      expect(result).toEqual({ id: 'docid', ...docData });
    });
  });

  describe('createDocument', () => {
    it('should add a document with timestamps and return docRef', async () => {
      const addMock = jest.fn().mockResolvedValue('docRef');
      collectionMock.add = addMock;
      const data = { foo: 'bar' };
      const result = await service.createDocument('users', data);
      expect(addMock).toHaveBeenCalledWith(
        expect.objectContaining({
          foo: 'bar',
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        }),
      );
      expect(result).toBe('docRef');
    });
  });

  describe('setDocument', () => {
    it('should set a document with timestamps and return docId', async () => {
      const setMock = jest.fn().mockResolvedValue(undefined);
      const docMock = { set: setMock };
      collectionMock.doc = jest.fn().mockReturnValue(docMock);
      const data = { foo: 'bar' };
      const docId = 'docid';
      const result = await service.setDocument('users', docId, data);
      expect(collectionMock.doc).toHaveBeenCalledWith(docId);
      expect(setMock).toHaveBeenCalledWith(
        expect.objectContaining({
          foo: 'bar',
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        }),
      );
      expect(result).toBe(docId);
    });
  });

  describe('updateDocument', () => {
    it('should update a document with updatedAt and return docId', async () => {
      const updateMock = jest.fn().mockResolvedValue(undefined);
      const docMock = { update: updateMock };
      collectionMock.doc = jest.fn().mockReturnValue(docMock);
      const data = { foo: 'baz' };
      const docId = 'docid';
      const result = await service.updateDocument('users', docId, data);
      expect(collectionMock.doc).toHaveBeenCalledWith(docId);
      expect(updateMock).toHaveBeenCalledWith(
        expect.objectContaining({ foo: 'baz', updatedAt: expect.anything() }),
      );
      expect(result).toBe(docId);
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document and return WriteResult', async () => {
      const deleteMock = jest.fn().mockResolvedValue('writeResult');
      const docMock = { delete: deleteMock };
      collectionMock.doc = jest.fn().mockReturnValue(docMock);
      const docId = 'docid';
      const result = await service.deleteDocument('users', docId);
      expect(collectionMock.doc).toHaveBeenCalledWith(docId);
      expect(deleteMock).toHaveBeenCalled();
      expect(result).toBe('writeResult');
    });
  });

  describe('getAllDocuments', () => {
    it('should return all documents in a collection', async () => {
      const docs = [
        { id: '1', data: () => ({ foo: 'bar' }) },
        { id: '2', data: () => ({ foo: 'baz' }) },
      ];
      collectionMock.get.mockResolvedValue({ docs });
      const result = await service.getAllDocuments('users');
      expect(result).toEqual([
        { id: '1', foo: 'bar' },
        { id: '2', foo: 'baz' },
      ]);
    });
  });

  describe('queryDocuments', () => {
    it('should query documents and return matching data', async () => {
      const docs = [
        { id: '1', data: () => ({ foo: 'bar' }) },
        { id: '2', data: () => ({ foo: 'baz' }) },
      ];
      collectionMock.where = jest.fn().mockReturnThis();
      collectionMock.get.mockResolvedValue({ docs });
      const result = await service.queryDocuments('users', 'foo', '==', 'bar');
      expect(collectionMock.where).toHaveBeenCalledWith('foo', '==', 'bar');
      expect(result).toEqual([
        { id: '1', foo: 'bar' },
        { id: '2', foo: 'baz' },
      ]);
    });
  });
});
