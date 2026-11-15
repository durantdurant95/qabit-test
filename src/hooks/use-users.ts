import { useQuery } from "@tanstack/react-query";

import { getUsers } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function useUsers(q = "") {
  return useQuery({
    queryKey: queryKeys.users.list(q),
    queryFn: ({ signal }) => getUsers(q, { signal }),
  });
}
