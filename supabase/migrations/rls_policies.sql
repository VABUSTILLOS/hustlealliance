-- ============================================================================
-- RLS Policies for hustlealliance (29 public tables)
-- Run in: Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/yftgdtdvmvvqyzcdntge/sql/new
-- ============================================================================

-- ============================================================================
-- GROUP 1: PUBLIC READ — Anyone can read; only authenticated can modify
--           Category, Badge, Course, Module, Lesson, CourseAttachment,
--           LessonAttachment, LiveClass
-- ============================================================================

ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_category" ON "Category" FOR SELECT USING (true);
CREATE POLICY "auth_insert_category" ON "Category" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_category" ON "Category" FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_category" ON "Category" FOR DELETE USING (auth.role() = 'authenticated');

ALTER TABLE "Badge" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_badge" ON "Badge" FOR SELECT USING (true);
CREATE POLICY "auth_insert_badge" ON "Badge" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_badge" ON "Badge" FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_badge" ON "Badge" FOR DELETE USING (auth.role() = 'authenticated');

ALTER TABLE "Course" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_course" ON "Course" FOR SELECT USING (true);
CREATE POLICY "auth_insert_course" ON "Course" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_course" ON "Course" FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_course" ON "Course" FOR DELETE USING (auth.role() = 'authenticated');

ALTER TABLE "Module" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_module" ON "Module" FOR SELECT USING (true);
CREATE POLICY "auth_insert_module" ON "Module" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_module" ON "Module" FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_module" ON "Module" FOR DELETE USING (auth.role() = 'authenticated');

ALTER TABLE "Lesson" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_lesson" ON "Lesson" FOR SELECT USING (true);
CREATE POLICY "auth_insert_lesson" ON "Lesson" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_lesson" ON "Lesson" FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_lesson" ON "Lesson" FOR DELETE USING (auth.role() = 'authenticated');

ALTER TABLE "CourseAttachment" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_course_att" ON "CourseAttachment" FOR SELECT USING (true);
CREATE POLICY "auth_insert_course_att" ON "CourseAttachment" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_course_att" ON "CourseAttachment" FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_course_att" ON "CourseAttachment" FOR DELETE USING (auth.role() = 'authenticated');

ALTER TABLE "LessonAttachment" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_lesson_att" ON "LessonAttachment" FOR SELECT USING (true);
CREATE POLICY "auth_insert_lesson_att" ON "LessonAttachment" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_lesson_att" ON "LessonAttachment" FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_lesson_att" ON "LessonAttachment" FOR DELETE USING (auth.role() = 'authenticated');

ALTER TABLE "LiveClass" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_live_class" ON "LiveClass" FOR SELECT USING (true);
CREATE POLICY "auth_insert_live_class" ON "LiveClass" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_live_class" ON "LiveClass" FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_live_class" ON "LiveClass" FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================================
-- GROUP 2: AUTHENTICATED READ — Must be logged in to read
--           Quiz, QuizQuestion, QuizAnswer, CommunityPost, CommunityComment
-- ============================================================================

ALTER TABLE "Quiz" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_read_quiz" ON "Quiz" FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_insert_quiz" ON "Quiz" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_quiz" ON "Quiz" FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_quiz" ON "Quiz" FOR DELETE USING (auth.role() = 'authenticated');

ALTER TABLE "QuizQuestion" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_read_quiz_q" ON "QuizQuestion" FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_insert_quiz_q" ON "QuizQuestion" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_quiz_q" ON "QuizQuestion" FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_quiz_q" ON "QuizQuestion" FOR DELETE USING (auth.role() = 'authenticated');

ALTER TABLE "QuizAnswer" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_read_quiz_a" ON "QuizAnswer" FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_insert_quiz_a" ON "QuizAnswer" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_quiz_a" ON "QuizAnswer" FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_quiz_a" ON "QuizAnswer" FOR DELETE USING (auth.role() = 'authenticated');

ALTER TABLE "CommunityPost" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_read_community_post" ON "CommunityPost" FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "user_insert_community_post" ON "CommunityPost" FOR INSERT WITH CHECK (auth.uid()::text = "authorId");
CREATE POLICY "user_update_community_post" ON "CommunityPost" FOR UPDATE USING (auth.uid()::text = "authorId");
CREATE POLICY "user_delete_community_post" ON "CommunityPost" FOR DELETE USING (auth.uid()::text = "authorId");

ALTER TABLE "CommunityComment" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_read_community_comment" ON "CommunityComment" FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "user_insert_community_comment" ON "CommunityComment" FOR INSERT WITH CHECK (auth.uid()::text = "authorId");
CREATE POLICY "user_update_community_comment" ON "CommunityComment" FOR UPDATE USING (auth.uid()::text = "authorId");
CREATE POLICY "user_delete_community_comment" ON "CommunityComment" FOR DELETE USING (auth.uid()::text = "authorId");

-- ============================================================================
-- GROUP 3: USER-SCOPED — Users can only access their own rows
--           Enrollment, LessonProgress, QuizAttempt, EarnedBadge, Certificate,
--           XPTransaction, Streak, Notification, ContentRelease,
--           LiveClassRegistration
-- ============================================================================

ALTER TABLE "Enrollment" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_read_enrollment" ON "Enrollment" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "user_insert_enrollment" ON "Enrollment" FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "user_update_enrollment" ON "Enrollment" FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "user_delete_enrollment" ON "Enrollment" FOR DELETE USING (auth.uid()::text = "userId");

ALTER TABLE "LessonProgress" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_read_lesson_progress" ON "LessonProgress" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "user_insert_lesson_progress" ON "LessonProgress" FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "user_update_lesson_progress" ON "LessonProgress" FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "user_delete_lesson_progress" ON "LessonProgress" FOR DELETE USING (auth.uid()::text = "userId");

ALTER TABLE "QuizAttempt" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_read_quiz_attempt" ON "QuizAttempt" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "user_insert_quiz_attempt" ON "QuizAttempt" FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "user_update_quiz_attempt" ON "QuizAttempt" FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "user_delete_quiz_attempt" ON "QuizAttempt" FOR DELETE USING (auth.uid()::text = "userId");

ALTER TABLE "EarnedBadge" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_read_earned_badge" ON "EarnedBadge" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "user_insert_earned_badge" ON "EarnedBadge" FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "user_update_earned_badge" ON "EarnedBadge" FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "user_delete_earned_badge" ON "EarnedBadge" FOR DELETE USING (auth.uid()::text = "userId");

ALTER TABLE "Certificate" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_read_certificate" ON "Certificate" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "user_insert_certificate" ON "Certificate" FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "user_update_certificate" ON "Certificate" FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "user_delete_certificate" ON "Certificate" FOR DELETE USING (auth.uid()::text = "userId");

ALTER TABLE "XPTransaction" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_read_xp" ON "XPTransaction" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "user_insert_xp" ON "XPTransaction" FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "user_update_xp" ON "XPTransaction" FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "user_delete_xp" ON "XPTransaction" FOR DELETE USING (auth.uid()::text = "userId");

ALTER TABLE "Streak" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_read_streak" ON "Streak" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "user_insert_streak" ON "Streak" FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "user_update_streak" ON "Streak" FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "user_delete_streak" ON "Streak" FOR DELETE USING (auth.uid()::text = "userId");

ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_read_notification" ON "Notification" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "user_insert_notification" ON "Notification" FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "user_update_notification" ON "Notification" FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "user_delete_notification" ON "Notification" FOR DELETE USING (auth.uid()::text = "userId");

ALTER TABLE "ContentRelease" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_read_content_release" ON "ContentRelease" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "user_insert_content_release" ON "ContentRelease" FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "user_update_content_release" ON "ContentRelease" FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "user_delete_content_release" ON "ContentRelease" FOR DELETE USING (auth.uid()::text = "userId");

ALTER TABLE "LiveClassRegistration" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_read_lc_reg" ON "LiveClassRegistration" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "user_insert_lc_reg" ON "LiveClassRegistration" FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "user_update_lc_reg" ON "LiveClassRegistration" FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "user_delete_lc_reg" ON "LiveClassRegistration" FOR DELETE USING (auth.uid()::text = "userId");

-- ============================================================================
-- GROUP 4: SERVER-ONLY — Restricted access; mutations blocked at PostgREST
--           User, Order, Entitlement, CourseDripSettings, LessonDripOverride,
--           LessonPrerequisite
-- ============================================================================

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_own_profile" ON "User" FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "read_public_profile" ON "User" FOR SELECT USING (true);
CREATE POLICY "block_insert_user" ON "User" FOR INSERT WITH CHECK (false);
CREATE POLICY "block_update_user" ON "User" FOR UPDATE USING (false);
CREATE POLICY "block_delete_user" ON "User" FOR DELETE USING (false);

ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_read_own_orders" ON "Order" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "block_insert_order" ON "Order" FOR INSERT WITH CHECK (false);
CREATE POLICY "block_update_order" ON "Order" FOR UPDATE USING (false);
CREATE POLICY "block_delete_order" ON "Order" FOR DELETE USING (false);

ALTER TABLE "Entitlement" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_read_own_entitlements" ON "Entitlement" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "block_insert_entitlement" ON "Entitlement" FOR INSERT WITH CHECK (false);
CREATE POLICY "block_update_entitlement" ON "Entitlement" FOR UPDATE USING (false);
CREATE POLICY "block_delete_entitlement" ON "Entitlement" FOR DELETE USING (false);

ALTER TABLE "CourseDripSettings" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_read_drip" ON "CourseDripSettings" FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "block_insert_drip" ON "CourseDripSettings" FOR INSERT WITH CHECK (false);
CREATE POLICY "block_update_drip" ON "CourseDripSettings" FOR UPDATE USING (false);
CREATE POLICY "block_delete_drip" ON "CourseDripSettings" FOR DELETE USING (false);

ALTER TABLE "LessonDripOverride" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_read_ldo" ON "LessonDripOverride" FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "block_insert_ldo" ON "LessonDripOverride" FOR INSERT WITH CHECK (false);
CREATE POLICY "block_update_ldo" ON "LessonDripOverride" FOR UPDATE USING (false);
CREATE POLICY "block_delete_ldo" ON "LessonDripOverride" FOR DELETE USING (false);

ALTER TABLE "LessonPrerequisite" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_read_prereq" ON "LessonPrerequisite" FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "block_insert_prereq" ON "LessonPrerequisite" FOR INSERT WITH CHECK (false);
CREATE POLICY "block_update_prereq" ON "LessonPrerequisite" FOR UPDATE USING (false);
CREATE POLICY "block_delete_prereq" ON "LessonPrerequisite" FOR DELETE USING (false);
