# Room Applications

This folder contains all room tour applications submitted by students. Each application is saved as a JSON file with the following naming convention:

`application_{id}_{timestamp}.json`

## File Structure

Each application file contains:

- **id**: Unique application identifier
- **fullName**: Student's full name
- **email**: Contact email
- **phoneNumber**: Phone number (optional)
- **hallName**: Dormitory hall name
- **roomNumber**: Room number (optional)
- **campus**: Campus name (optional)
- **school**: School/university name (optional)
- **academicYear**: Academic year (optional)
- **description**: Room description
- **photoUrls**: Array of photo URLs
- **status**: Application status (PENDING, APPROVED, REJECTED)
- **submittedAt**: Submission timestamp
- **updatedAt**: Last update timestamp (optional)

## Managing Applications

### Command Line Tool

Use the provided script to manage applications:

```bash
# List all applications
node scripts/view-applications.js list

# View specific application
node scripts/view-applications.js view application_123_1234567890.json

# Approve application
node scripts/view-applications.js approve application_123_1234567890.json

# Reject application
node scripts/view-applications.js reject application_123_1234567890.json

# Delete application
node scripts/view-applications.js delete application_123_1234567890.json
```

### Web Interface

Visit `/admin/applications` to view and manage applications through the web interface.

## Status Management

- **PENDING**: Newly submitted, awaiting review
- **APPROVED**: Application approved, room can be featured
- **REJECTED**: Application rejected, will not be featured

## File Organization

Applications are automatically sorted by submission date (newest first) and can be easily searched by:

- Student name
- Hall name
- School name
- Status
- Submission date
