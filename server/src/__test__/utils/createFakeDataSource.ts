export function createFakeRepository<T>() {
    return {
        __data: [] as any[],

    
        create(data: any) {
            return { ...data };
        },

        async save(entity: any) {
            if (Array.isArray(entity)) {
                entity.forEach(e => {
                    if (!e.id) e.id = this.__data.length + 1;
                    this.__data.push(e);
                });
                return entity;
            }

            if (!entity.id) entity.id = this.__data.length + 1;

            this.__data.push(entity);
            return entity;
        }
        ,

   
        async findOne(opts: any) {
            const id = opts?.where?.id;
            return this.__data.find((item: any) => item.id === id) ?? null;
        },

        
        async update(id: number, partial: any) {
            const item = this.__data.find((x: any) => x.id === id);
            if (item) Object.assign(item, partial);
            return item;
        },

     
        async delete(opts: any) {
            const id = opts?.id ?? opts?.where?.id ?? opts;
            this.__data = this.__data.filter((item: any) => item.id !== id);
            return { affected: 1 };
        },

 
        async softDelete(id: number) {
            this.__data = this.__data.filter((item: any) => item.id !== id);
            return { affected: 1 };
        }
    };
}
