CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'student',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PracticeSession" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "section" TEXT NOT NULL,
  "moduleId" TEXT NOT NULL,
  "mode" TEXT NOT NULL DEFAULT 'infinite',
  "correct" INTEGER NOT NULL DEFAULT 0,
  "attempted" INTEGER NOT NULL DEFAULT 0,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endedAt" TIMESTAMP(3),
  CONSTRAINT "PracticeSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "QuestionAttempt" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "section" TEXT NOT NULL,
  "moduleId" TEXT NOT NULL,
  "questionPayload" JSONB NOT NULL,
  "questionSignature" TEXT NOT NULL,
  "correctAnswer" TEXT NOT NULL,
  "userAnswer" TEXT,
  "isCorrect" BOOLEAN,
  "submitted" BOOLEAN NOT NULL DEFAULT false,
  "responseMs" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "answeredAt" TIMESTAMP(3),
  CONSTRAINT "QuestionAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Progress" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "section" TEXT NOT NULL,
  "moduleId" TEXT NOT NULL,
  "correct" INTEGER NOT NULL DEFAULT 0,
  "attempted" INTEGER NOT NULL DEFAULT 0,
  "bestStreak" INTEGER NOT NULL DEFAULT 0,
  "currentStreak" INTEGER NOT NULL DEFAULT 0,
  "lastPracticedAt" TIMESTAMP(3),
  CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Classroom" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "teacherId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClassEnrollment" (
  "id" TEXT NOT NULL,
  "classroomId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClassEnrollment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "QuestionAttempt_userId_section_moduleId_idx" ON "QuestionAttempt"("userId", "section", "moduleId");
CREATE INDEX "QuestionAttempt_sessionId_idx" ON "QuestionAttempt"("sessionId");
CREATE UNIQUE INDEX "Progress_userId_section_moduleId_key" ON "Progress"("userId", "section", "moduleId");
CREATE UNIQUE INDEX "ClassEnrollment_classroomId_userId_key" ON "ClassEnrollment"("classroomId", "userId");

ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PracticeSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClassEnrollment" ADD CONSTRAINT "ClassEnrollment_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClassEnrollment" ADD CONSTRAINT "ClassEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
