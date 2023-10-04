import { component$, useSignal, useStore, useStylesScoped$, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import styles from './paginated-table.css?inline';
import { authorizedFetch } from '../../../shared/auth.service';

export interface PaginatedTableProps {
  headers: {
    key: string;
    label: string;
  }[];
  endpoint: string;
  limit?: number;
}

export const PaginatedTable = component$((props: PaginatedTableProps) => {
  useStylesScoped$(styles);

  const page = useSignal<number>(1);
  const limit = useSignal<number>(props.limit || 10);
  const data = useSignal<any[]>([]);
  const total = useSignal<number>(0);

  useVisibleTask$(async () => {
    const response = await authorizedFetch(`${props.endpoint}?page=${page.value}&limit=${limit.value}`);
    const result = await response.json();
    data.value = result.data;
    total.value = result.total;
  });

  return (
    <div class="overflow-x-auto">
      <table class="table table-zebra w-full">
        {/* head */}
        <thead>
          <tr>
            {props.headers.map((header) => (
              <th>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* body */}
          {data.value.map((row) => (
            <tr>
              {props.headers.map((header) => (
                <td>{row[header.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
