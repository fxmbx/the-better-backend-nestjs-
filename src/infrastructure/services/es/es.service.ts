import { Injectable } from '@nestjs/common';
import {
  BulkResponse,
  WriteResponseBase,
} from '@elastic/elasticsearch/lib/api/types';
import { IEsService } from 'src/domain/adapter/es.interface';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class EsService implements IEsService {
  constructor(private readonly esService: ElasticsearchService) {}

  async indexDocument<T>(
    index: string,
    body: T,
    id?: string,
  ): Promise<WriteResponseBase> {
    const indexed = await this.esService.index<T>({
      index,
      id,
      document: body,
    });
    return indexed;
  }

  async bulkIndexDocuments<T>(
    index: string,
    documents: T[],
  ): Promise<BulkResponse> {
    const body = documents.flatMap((doc) => [
      { index: { _index: index } },
      doc,
    ]);

    const response = await this.esService.bulk({
      body,
    });
    return response;
  }

  async searchDocuments<T>(index: string, query: string, fields?: string[]) {
    const searchResult = await this.esService.search<T>({
      index,
      body: {
        query: {
          multi_match: {
            query: query,
            fields,
          },
        },
      },
    });
    const hits = searchResult.hits.hits;
    const response = hits.map((item) => item._source);
    return response;
  }

  async getAllDocuments<T>(index: string): Promise<any[]> {
    const searchResult = await this.esService.search<T>({
      index,
      body: {
        query: {
          match_all: {},
        },
      },
    });

    const hits = searchResult.hits.hits;
    const documents = hits.map((hit) => hit._source);
    return documents;
  }

  async updateDocument<T>(index: string, id: string, body: Partial<T>) {
    const updated = await this.esService.update({
      index,
      id,
      body: {
        doc: body,
      },
    });
    return updated;
  }

  async deleteDocument(index: string, id: string) {
    return this.esService.delete({
      index,
      id,
    });
  }
}
