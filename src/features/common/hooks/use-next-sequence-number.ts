import { useQuery } from "@tanstack/react-query";
import { sequenceApiService } from "../../../services/adapters/sequences.api";

export function useNextSequenceQuery(key: string) {
  return useQuery({
    queryKey: ["next-sequence", key],
    queryFn: () => sequenceApiService.getPreviewNext(key),
    staleTime: 0,
    enabled: !!key
  });
}
