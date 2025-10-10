---
title: "Resume"
description: "Download my comprehensive CV showcasing experience across science, policy, and technology"
layout: "layouts/page.njk"
permalink: "/resume/"
eleventyNavigation:
  key: "Resume"
  order: 3
---

# Resume & CV

Download my comprehensive curriculum vitae to learn more about my professional experience, education, and accomplishments across science, policy, and technology domains.

## Download CV

{% set resumeData = site.resume %}
{% if resumeData.filename %}
<div class="bg-surface border border-secondary border-opacity-20 rounded-lg p-6 max-w-md">
    <div class="flex items-start space-x-4">
        <div class="flex-shrink-0">
            <svg class="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
        </div>
        <div class="flex-1 min-w-0">
            <h3 class="text-lg font-headline font-semibold text-text mb-2">Curriculum Vitae</h3>
            <p class="text-textSecondary text-sm mb-4">
                Comprehensive CV including education, experience, publications, and technical skills.
                {% if resumeData.lastUpdated %}
                <br><span class="text-xs">Last updated: {{ resumeData.lastUpdated | dateFormat }}</span>
                {% endif %}
            </p>
            <a href="{{ resumeData.path }}" 
               target="_blank"
               rel="noopener noreferrer"
               download="{{ resumeData.filename }}"
               class="inline-flex items-center px-4 py-2 bg-primary text-surface rounded-lg hover:bg-secondary transition-colors duration-200 font-medium">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Download PDF
            </a>
        </div>
    </div>
</div>
{% else %}
<div class="bg-neutral-50 border border-neutral-200 rounded-lg p-6 max-w-md">
    <p class="text-textSecondary">Resume download will be available soon.</p>
</div>
{% endif %}

## Professional Summary

This CV provides a comprehensive overview of my professional journey, including:

- **Education & Certifications**: Academic background and professional development
- **Professional Experience**: Detailed work history across science, policy, and technology sectors
- **Research & Publications**: Academic contributions and research outputs
- **Technical Skills**: Programming languages, tools, and methodologies
- **Leadership & Service**: Community involvement and professional service
- **Awards & Recognition**: Honors and achievements

## Alternative Formats

For accessibility or specific requirements, alternative formats may be available upon request. Please contact me directly for:

- **Accessible formats** (screen reader compatible, large print)
- **Targeted versions** (research-focused, policy-focused, or technical-focused)
- **References and recommendations** from colleagues and supervisors

---

*For the most current information about my work and recent projects, please visit the [Experience](/), [Projects](/#projects), and [Publications](/#publications) sections of this portfolio.*