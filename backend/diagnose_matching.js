import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';
import StudentProfile from './models/StudentProfile.js';

dotenv.config();

async function diagnose() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const sampleJob = await Job.findOne({ status: 'approved' });
        if (!sampleJob) {
            console.log('No approved jobs found');
        } else {
            console.log('Job found:', sampleJob.title);
            console.log('Job requirements:', sampleJob.requirements);
            console.log('Raw sampleJob.requirements type:', typeof sampleJob.requirements);
            console.log('Is Array?', Array.isArray(sampleJob.requirements));
        }

        const sampleProfile = await StudentProfile.findOne({ skills: { $exists: true, $not: { $size: 0 } } });
        if (!sampleProfile) {
            console.log('No student profile with skills found');
        } else {
            console.log('Profile found for user:', sampleProfile.user);
            console.log('Profile skills:', sampleProfile.skills);
            console.log('Raw sampleProfile.skills type:', typeof sampleProfile.skills);
            console.log('Is Array?', Array.isArray(sampleProfile.skills));

            if (sampleJob) {
                const studentSkills = (sampleProfile.skills || []).map(s => String(s).toLowerCase().trim());
                const jobSkills = (sampleJob.requirements || []).map(s => String(s).toLowerCase().trim());

                console.log('Normalized studentSkills:', studentSkills);
                console.log('Normalized jobSkills:', jobSkills);

                let matchedCount = 0;
                jobSkills.forEach(req => {
                    const isMatched = studentSkills.some(skill =>
                        skill === req || skill.includes(req) || req.includes(skill)
                    );
                    if (isMatched) {
                        console.log(`Matched! Skill "${req}" found.`);
                        matchedCount++;
                    }
                });

                const score = (matchedCount / jobSkills.length) * 100;
                console.log('Calculated Score:', Math.round(score), '%');
            }
        }

        process.exit();
    } catch (err) {
        console.error('Diagnostic failed:', err);
        process.exit(1);
    }
}

diagnose();
