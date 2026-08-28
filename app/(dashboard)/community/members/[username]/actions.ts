'use server';

import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/user';
import { revalidatePath } from 'next/cache';

async function requireUserId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  return user.id;
}

async function requireOwnedList(listId: string, ownerId: string) {
  const list = await prisma.memberList.findUnique({
    where: { id: listId },
    select: { ownerId: true },
  });
  if (!list) throw new Error('List not found');
  if (list.ownerId !== ownerId) throw new Error('Forbidden');
  return list;
}

export async function toggleFollow(followedId: string) {
  const followerId = await requireUserId();

  if (followedId === followerId) throw new Error('Cannot follow yourself');

  const existing = await prisma.follow.findUnique({
    where: { followerId_followedId: { followerId, followedId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
  } else {
    await prisma.follow.create({
      data: { followerId, followedId },
    });
  }

  revalidatePath('/community/members/[username]', 'layout');
}

export async function addToList(
  memberId: string,
  listId: string,
  note?: string,
) {
  const ownerId = await requireUserId();
  await requireOwnedList(listId, ownerId);

  const existing = await prisma.memberListItem.findUnique({
    where: { listId_memberId: { listId, memberId } },
  });

  if (!existing) {
    await prisma.memberListItem.create({
      data: { listId, memberId, note },
    });
  }

  revalidatePath('/community/members/[username]', 'layout');
}

export async function createList(name: string): Promise<string> {
  const ownerId = await requireUserId();
  const list = await prisma.memberList.create({
    data: { ownerId, name },
  });
  return list.id;
}

export async function getLists() {
  const ownerId = await requireUserId();
  return prisma.memberList.findMany({
    where: { ownerId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, _count: { select: { items: true } } },
  });
}

export async function removeFromList(listId: string, memberId: string) {
  const ownerId = await requireUserId();
  await requireOwnedList(listId, ownerId);

  await prisma.memberListItem.deleteMany({
    where: { listId, memberId },
  });
  revalidatePath('/community/members/[username]', 'layout');
}
