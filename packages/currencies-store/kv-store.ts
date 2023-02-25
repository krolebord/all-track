export const createKvJsonStore =  <TData, TMetaData>() => ({
  put: async (kv: KVNamespace, key: string, data: TData, metadata: TMetaData) => {
    await kv.put(key, JSON.stringify(data), { metadata });
  },
  get: async (kv: KVNamespace, key: string): Promise<{ data: TData, meta: TMetaData } | null> => {
    const result = await kv.getWithMetadata<TData, TMetaData>(key, 'json');
    if (!result.value || !result.metadata) {
      return null;
    }
    return {
      data: result.value,
      meta: result.metadata
    };
  }
}); 
