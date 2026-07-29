'use server';

import prisma from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleFollow(followerId: string, followedId: string) {
  'use server';
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
  ownerId: string,
  memberId: string,
  listId: string,
  note?: string,
) {
  'use server';
  const existing = await prisma.memberListItem.findUnique({
    where: { listId_memberId: { listId, memberId } },
    include: { list: { select: { ownerId: true } } },
  });

  if (!existing) {
    await prisma.memberListItem.create({
      data: { listId, memberId, note },
    });
  }

  revalidatePath('/community/members/[username]', 'layout');
}

export async function createList(ownerId: string, name: string): Promise<string> {
  'use server';
  const list = await prisma.memberList.create({
    data: { ownerId, name },
  });
  return list.id;
}

export async function getLists(ownerId: string) {
  'use server';
  return prisma.memberList.findMany({
    where: { ownerId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, _count: { select: { items: true } } },
  });
}

export async function removeFromList(listId: string, memberId: string) {
  'use server';
  await prisma.memberListItem.deleteMany({
    where: { listId, memberId },
  });
  revalidatePath('/community/members/[username]', 'layout');
}
