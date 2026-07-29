'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

interface Group {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatar: string | null;
  coverImage: string | null;
  visibility: 'PUBLIC' | 'PRIVATE' | 'HIDDEN';
  creatorId: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  creator?: { id: string; name: string; username: string | null; avatar: string | null };
  _count?: { members?: number; groupPosts?: number; events?: number };
  currentUserRole?: string | null;
  currentUserMember?: boolean;
}

interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER';
  status: 'ACTIVE' | 'INVITED' | 'REQUESTED' | 'BANNED';
  joinedAt: string;
  user: { id: string; name: string; username: string | null; avatar: string | null; headline?: string | null };
}

interface GroupInvite {
  id: string;
  groupId: string;
  userId: string;
  role: string;
  status: string;
  joinedAt: string;
  group: {
    id: string;
    name: string;
    slug: string;
    avatar: string | null;
    description: string | null;
    memberCount: number;
  };
}

interface GroupStats {
  memberCount: number;
  postCount: number;
  activeToday: number;
}

interface GroupPost {
  id: string;
  groupId: string;
  authorId: string;
  content: string;
  imageUrls: string[];
  isPinned: boolean;
  createdAt: string;
  author: { id: string; name: string; username: string | null; avatar: string | null };
  comments: Array<{
    id: string;
    author: { id: string; name: string; username: string | null; avatar: string | null };
    content: string;
    createdAt: string;
  }>;
}

// ── Groups list ──

export function useGroups(filters?: { query?: string; visibility?: string; my?: boolean }) {
  return useQuery<Group[]>({
    queryKey: ['groups', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.query) params.set('query', filters.query);
      if (filters?.visibility) params.set('visibility', filters.visibility);
      if (filters?.my) params.set('my', 'true');
      const res = await fetch(`/api/groups?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch groups');
      return res.json();
    },
    staleTime: 30_000,
  });
}

// ── Single group ──

export function useGroup(slugOrId: string) {
  return useQuery<Group & { currentUserRole: string | null; currentUserMember: boolean }>({
    queryKey: ['group', slugOrId],
    queryFn: async () => {
      const res = await fetch(`/api/groups/${slugOrId}`);
      if (!res.ok) throw new Error('Failed to fetch group');
      return res.json();
    },
    enabled: !!slugOrId,
    staleTime: 30_000,
  });
}

// ── Group members ──

export function useGroupMembers(groupId: string) {
  return useQuery<GroupMember[]>({
    queryKey: ['group-members', groupId],
    queryFn: async () => {
      const res = await fetch(`/api/groups/${groupId}/members`);
      if (!res.ok) throw new Error('Failed to fetch members');
      return res.json();
    },
    enabled: !!groupId,
    staleTime: 30_000,
  });
}

// ── Group feed ──

export function useGroupFeed(groupId: string) {
  return useInfiniteQuery<GroupPost[]>({
    queryKey: ['group-feed', groupId],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set('limit', '20');
      if (pageParam) params.set('cursor', pageParam as string);
      const res = await fetch(`/api/groups/${groupId}/feed?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch feed');
      return res.json();
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < 20) return undefined;
      return lastPage[lastPage.length - 1]?.id;
    },
    enabled: !!groupId,
    staleTime: 30_000,
  });
}

// ── Group stats ──

export function useGroupStats(groupId: string) {
  return useQuery<GroupStats>({
    queryKey: ['group-stats', groupId],
    queryFn: async () => {
      const res = await fetch(`/api/groups/${groupId}/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
    enabled: !!groupId,
  });
}

// ── User groups ──

export function useUserGroups(userId: string) {
  return useQuery<Array<{ group: Group }>>({
    queryKey: ['user-groups', userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}/groups`);
      if (!res.ok) throw new Error('Failed to fetch user groups');
      return res.json();
    },
    enabled: !!userId,
  });
}

// ── Invites ──

export function useGroupInvites() {
  const queryClient = useQueryClient();
  const invitesQuery = useQuery<GroupInvite[]>({
    queryKey: ['group-invites'],
    queryFn: async () => {
      const res = await fetch('/api/groups/invites');
      if (!res.ok) throw new Error('Failed to fetch invites');
      return res.json();
    },
  });

  const acceptInvite = useMutation({
    mutationFn: async (memberId: string) => {
      const res = await fetch(`/api/groups/invites/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' }),
      });
      if (!res.ok) throw new Error('Failed to accept invite');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-invites'] });
      queryClient.invalidateQueries({ queryKey: ['user-groups'] });
    },
  });

  const rejectInvite = useMutation({
    mutationFn: async (memberId: string) => {
      const res = await fetch(`/api/groups/invites/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      });
      if (!res.ok) throw new Error('Failed to reject invite');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-invites'] });
    },
  });

  return { invitesQuery, acceptInvite, rejectInvite };
}

// ── Mutations ──

export function useJoinGroup(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/groups/${groupId}/join`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to join group');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['group-members', groupId] });
      queryClient.invalidateQueries({ queryKey: ['user-groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useLeaveGroup(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/groups/${groupId}/leave`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to leave group');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['group-members', groupId] });
      queryClient.invalidateQueries({ queryKey: ['user-groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      slug: string;
      description?: string;
      visibility?: string;
      avatar?: string;
      coverImage?: string;
    }) => {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create group');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useUpdateGroup(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update group');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useDeleteGroup(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/groups/${groupId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete group');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useInviteToGroup(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/groups/${groupId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error('Failed to invite user');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-members', groupId] });
    },
  });
}

export function useUpdateMemberRole(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const res = await fetch(`/api/groups/${groupId}/members/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error('Failed to update role');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-members', groupId] });
    },
  });
}

export function useRemoveMember(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/groups/${groupId}/members/${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove member');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-members', groupId] });
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
    },
  });
}
