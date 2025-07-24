import { Injectable, Inject } from '@nestjs/common';
import { Timestamp, WriteResult } from '@google-cloud/firestore';
import { FIREBASE_ADMIN } from '../firebase-admin-init';

@Injectable()
export class FirestoreService {
  private readonly db: FirebaseFirestore.Firestore;

  constructor(@Inject(FIREBASE_ADMIN) private readonly admin: any) {
    this.db = this.admin.firestore();
    this.db.settings({ ignoreUndefinedProperties: true });
  }

  getCollection(collectionName: string) {
    return this.db.collection(collectionName);
  }

  // Creates a new document in the specified collection with auto-generated ID
  // Returns the complete data of the created document
  // What will it return if the document already exists?
  // If a document with the same ID already exists, it will create a new document with a different auto-generated ID.
  async createDocument(collection: string, data: Record<string, unknown>) {
    const now = Timestamp.now();
    const docRef = await this.db.collection(collection).add({
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    return docRef;
  }

  // Sets a document with a specific ID, overwriting any existing data
  // Returns the ID of the document
  async setDocument(
    collection: string,
    docId: string,
    data: Record<string, unknown>,
  ) {
    const now = Timestamp.now();
    await this.db
      .collection(collection)
      .doc(docId)
      .set({
        ...data,
        createdAt: now,
        updatedAt: now,
      });
    return docId;
  }

  // Updates an existing document with the specified ID
  // Returns the ID of the updated document
  async updateDocument(
    collection: string,
    docId: string,
    data: Record<string, unknown>,
  ) {
    const now = Timestamp.now();
    await this.db
      .collection(collection)
      .doc(docId)
      .update({
        ...data,
        updatedAt: now,
      });
    return docId;
  }

  // Retrieves a document by its ID
  // Returns the document data or null if it does not exist
  async getDocument(collection: string, userId: string) {
    const snapshot = await this.db.collection(collection).where('userId', '==', userId).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  // Deletes a document by its ID
  // Returns a WriteResult indicating the outcome of the delete operation
  async deleteDocument(
    collection: string,
    docId: string,
  ): Promise<WriteResult> {
    return await this.db.collection(collection).doc(docId).delete();
  }

  // Retrieves all documents in a collection
  // Returns an array of document data
  async getAllDocuments(
    collection: string,
  ): Promise<Record<string, unknown>[]> {
    const snapshot = await this.db.collection(collection).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // Queries documents based on a field, operator, and value
  // Returns an array of document data that match the query
  async queryDocuments(
    collection: string,
    field: string,
    operator: FirebaseFirestore.WhereFilterOp,
    value: unknown,
  ): Promise<Record<string, unknown>[]> {
    const snapshot = await this.db
      .collection(collection)
      .where(field, operator, value)
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}
