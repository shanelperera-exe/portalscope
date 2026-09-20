export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Interdimensional Explorer API',
    version: '1.0.0',
    description:
      'Backend API for the Interdimensional Explorer Harbor workload. All Rick and Morty data is proxied from the public API.',
  },
  servers: [{ url: '/api' }],
  paths: {
    '/health': {
      get: {
        summary: 'Liveness check',
        responses: {
          '200': { description: 'Service is running' },
        },
      },
    },
    '/ready': {
      get: {
        summary: 'Readiness check',
        responses: {
          '200': { description: 'Database is available' },
          '503': { description: 'Database is unavailable' },
        },
      },
    },
    '/characters': {
      get: {
        summary: 'List characters',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'name', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['alive', 'dead', 'unknown'] } },
          { name: 'species', in: 'query', schema: { type: 'string' } },
          { name: 'gender', in: 'query', schema: { type: 'string', enum: ['female', 'male', 'genderless', 'unknown'] } },
        ],
        responses: {
          '200': { description: 'Paginated character list' },
          '400': { description: 'Invalid query' },
          '502': { description: 'External API unavailable' },
        },
      },
    },
    '/characters/{id}': {
      get: {
        summary: 'Get a character',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Character' },
          '400': { description: 'Invalid ID' },
          '404': { description: 'Not found' },
          '502': { description: 'External API unavailable' },
        },
      },
    },
    '/locations': {
      get: {
        summary: 'List locations',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'name', in: 'query', schema: { type: 'string' } },
          { name: 'type', in: 'query', schema: { type: 'string' } },
          { name: 'dimension', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Paginated location list' } },
      },
    },
    '/locations/{id}': {
      get: {
        summary: 'Get a location',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Location with residents' },
          '404': { description: 'Not found' },
        },
      },
    },
    '/episodes': {
      get: {
        summary: 'List episodes',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'name', in: 'query', schema: { type: 'string' } },
          { name: 'episode', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Paginated episode list' } },
      },
    },
    '/episodes/{id}': {
      get: {
        summary: 'Get an episode',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Episode with characters' },
          '404': { description: 'Not found' },
        },
      },
    },
    '/favorites': {
      get: {
        summary: 'List demo-user favorites',
        responses: {
          '200': { description: 'Favorite characters' },
          '503': { description: 'Database unavailable' },
        },
      },
      post: {
        summary: 'Add a favorite',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['characterId'],
                properties: { characterId: { type: 'integer' } },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Favorite created' },
          '400': { description: 'Invalid request' },
          '404': { description: 'Character not found' },
          '409': { description: 'Duplicate favorite' },
        },
      },
    },
    '/favorites/{characterId}': {
      delete: {
        summary: 'Remove a favorite',
        parameters: [
          { name: 'characterId', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '204': { description: 'Removed' },
          '404': { description: 'Favorite not found' },
        },
      },
    },
  },
};
