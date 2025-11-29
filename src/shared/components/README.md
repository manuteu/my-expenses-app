# Componentes Compartilhados

## DataTable

Componente genérico e reutilizável para exibir tabelas de dados com loading states e paginação.

### Características

- ✅ **Type-safe** com TypeScript Generics
- ✅ **Skeleton loading** customizável
- ✅ **Empty state** configurável
- ✅ **Renderização customizada** de células
- ✅ **Responsivo** e acessível

### Uso Básico

```tsx
import { DataTable, type DataTableColumn } from "@/shared/components"

interface User {
  id: string
  name: string
  email: string
}

function UsersTable() {
  const users: User[] = [
    { id: '1', name: 'João', email: 'joao@email.com' },
    { id: '2', name: 'Maria', email: 'maria@email.com' },
  ]

  const columns: DataTableColumn<User>[] = [
    {
      header: "Nome",
      accessor: "name", // Renderização automática
      className: "font-medium"
    },
    {
      header: "Email",
      cell: (user) => ( // Renderização customizada
        <a href={`mailto:${user.email}`}>{user.email}</a>
      )
    },
    {
      header: "Ações",
      cell: (user) => (
        <button onClick={() => handleDelete(user.id)}>
          Deletar
        </button>
      )
    }
  ]

  return (
    <DataTable
      columns={columns}
      data={users}
      isLoading={false}
      emptyMessage="Nenhum usuário encontrado"
      getRowKey={(user) => user.id}
      skeletonRows={5}
      skeletonWidths={['w-[150px]', 'w-[200px]', 'w-[100px]']}
    />
  )
}
```

### Props

#### `columns: DataTableColumn<T>[]`
Define as colunas da tabela.

**DataTableColumn**:
- `header: string` - Texto do cabeçalho
- `accessor?: keyof T` - Campo do objeto para renderização automática
- `cell?: (item: T) => ReactNode` - Função de renderização customizada
- `className?: string` - Classes CSS para células
- `headerClassName?: string` - Classes CSS para cabeçalho

#### `data: T[]`
Array de dados a serem exibidos.

#### `isLoading?: boolean`
Estado de carregamento. Mostra skeletons quando `true`.

#### `emptyMessage?: string`
Mensagem exibida quando não há dados. Padrão: "Nenhum registro encontrado"

#### `skeletonRows?: number`
Número de linhas skeleton no loading. Padrão: `5`

#### `getRowKey: (item: T) => string`
Função para obter a chave única de cada linha.

#### `skeletonWidths?: string[]`
Array de classes Tailwind para largura dos skeletons.

---

## Pagination

Componente genérico de paginação.

### Uso

```tsx
import { Pagination } from "@/shared/components"

function MyList() {
  return (
    <Pagination
      currentPage={1}
      totalPages={10}
      total={100}
      limit={10}
      onPreviousPage={() => setPage(page - 1)}
      onNextPage={() => setPage(page + 1)}
      itemLabel="itens" // ou "usuários", "despesas", etc
    />
  )
}
```

### Props

- `currentPage: number` - Página atual
- `totalPages: number` - Total de páginas
- `total: number` - Total de registros
- `limit: number` - Registros por página
- `onPreviousPage: () => void` - Callback página anterior
- `onNextPage: () => void` - Callback próxima página
- `itemLabel?: string` - Label dos itens (padrão: "registros")

