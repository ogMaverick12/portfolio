"use client";

import { useEffect, useState } from "react";

interface RepoState {
  loading: boolean;
  exists: boolean;
}

const memoryCache: Record<string, RepoState> = {};

export function useGithubRepo(repoName: string) {
  const [state, setState] = useState<RepoState>({
    loading: true,
    exists: false,
  });

  useEffect(() => {
    if (!repoName) {
      setState({ loading: false, exists: false });
      return;
    }

    const cacheKey = repoName.toLowerCase();
    if (memoryCache[cacheKey]) {
      setState(memoryCache[cacheKey]);
      return;
    }

    let isMounted = true;

    async function checkRepo() {
      try {
        const res = await fetch(`https://api.github.com/repos/ogMaverick12/${repoName}`);
        const exists = res.status === 200;
        const newState = { loading: false, exists };
        memoryCache[cacheKey] = newState;
        if (isMounted) {
          setState(newState);
        }
      } catch (err) {
        const newState = { loading: false, exists: false };
        memoryCache[cacheKey] = newState;
        if (isMounted) {
          setState(newState);
        }
      }
    }

    checkRepo();

    return () => {
      isMounted = false;
    };
  }, [repoName]);

  return state;
}
