import { Box, Container, Typography, Paper, Chip } from '@mui/material';

const AboutPage = () => {
    const skills = [
        'React', 'Node.js', 'Express', 'Python', 'Flask', 'PostgreSQL',
        'TypeScript', 'JavaScript', 'HTML', 'CSS'
    ];

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Andre Harper
                    </Typography>
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        Computer Science Graduate
                    </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        About Me
                    </Typography>
                    <Typography>
                        I am a recent Computer Science graduate passionate about full-stack development and creating impactful web applications. 
                        This blog project showcases my ability to build modern, responsive web applications using cutting-edge technologies.
                    </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Technical Skills
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {skills.map((skill) => (
                            <Chip 
                                key={skill}
                                label={skill} 
                                color="primary" 
                                variant="outlined"
                            />
                        ))}
                    </Box>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        About This Project
                    </Typography>
                    <Typography paragraph>
                        This blog platform is a full-stack application that demonstrates my proficiency in modern web development. 
                        Built with React and Node.js, it features a clean, responsive design and robust functionality. 
                        The project showcases my ability to work with various technologies and implement best practices in web development.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default AboutPage;