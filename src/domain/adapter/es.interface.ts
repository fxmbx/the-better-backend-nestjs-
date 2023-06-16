export interface IEsService {
  indexDocument<T>(index: string, body: T, id?: string);
  bulkIndexDocuments<T>(index: string, documents: T[]);
  searchDocuments<T>(index: string, query: string, fields?: string[]);
  getAllDocuments<T>(index: string);
  updateDocument<T>(index: string, id: string, body: Partial<T>);
  deleteDocument(index: string, id: string);
}
