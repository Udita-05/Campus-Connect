/**
 * Robust skill matching and eligibility calculation
 * @param {Object} job - Job document or object
 * @param {Object} profile - StudentProfile document or object
 * @returns {Object} - Enriched job object
 */
export const calculateJobMatch = (job, profile) => {
    const jobObj = typeof job.toObject === 'function' ? job.toObject() : { ...job };

    if (!profile) {
        jobObj.matchScore = 0;
        jobObj.isEligible = false;
        return jobObj;
    }

    // 1. Fuzzy Skill Matching
    // Normalize skills: lower case, trimmed strings
    const studentSkills = (profile.skills || []).map(s => String(s).toLowerCase().trim()).filter(Boolean);
    const jobSkills = (job.requirements || []).map(s => String(s).toLowerCase().trim()).filter(Boolean);

    let matchedCount = 0;
    if (jobSkills.length > 0) {
        jobSkills.forEach(req => {
            const isMatched = studentSkills.some(skill => {
                // Direct match
                if (skill === req) return true;
                // Partial match: "React" in "React.js"
                if (skill.includes(req) || req.includes(skill)) return true;

                // Handle common variations (e.g., "NodeJS" vs "Node.js")
                const cleanSkill = skill.replace(/[^a-z0-9]/g, '');
                const cleanReq = req.replace(/[^a-z0-9]/g, '');
                if (cleanSkill && cleanReq && (cleanSkill.includes(cleanReq) || cleanReq.includes(cleanSkill))) return true;

                return false;
            });
            if (isMatched) matchedCount++;
        });
    }

    const skillScore = jobSkills.length > 0 ? (matchedCount / jobSkills.length) * 100 : 100;

    // 2. Academic Eligibility
    const studentCGPA = parseFloat(profile.cgpa) || 0;
    const minCGPA = parseFloat(job.minCGPA) || 0;
    const cgpaEligible = studentCGPA >= minCGPA;

    // 3. Branch Eligibility
    const studentBranch = String(profile.branch || '').toLowerCase().trim();
    const allowedBranches = (job.allowedBranches || []).map(b => String(b).toLowerCase().trim()).filter(Boolean);
    const branchEligible = allowedBranches.length === 0 || allowedBranches.includes(studentBranch);

    jobObj.matchScore = Math.round(skillScore);
    jobObj.isEligible = cgpaEligible && branchEligible;
    jobObj.missingRequirements = {
        cgpa: !cgpaEligible,
        branch: !branchEligible
    };

    return jobObj;
};
