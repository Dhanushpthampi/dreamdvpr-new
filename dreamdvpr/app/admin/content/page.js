'use client';

import { Box, Container, Heading, Text, VStack, HStack, Button, Spinner, useToast, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { AdminSidebarWrapper } from '@/app/components/AdminSidebar';
import GlassCard from '@/app/components/GlassCard';
import { useContentManagement } from '@/app/lib/content';
import { HeroSectionEditor } from './components/HeroSectionEditor';
import { ServicesSectionEditor } from './components/ServicesSectionEditor';
import { WhyChooseUsSectionEditor } from './components/WhyChooseUsSectionEditor';
import { ComparisonSectionEditor } from './components/ComparisonSectionEditor';
import { FAQSectionEditor } from './components/FAQSectionEditor';
import { CTASectionEditor } from './components/CTASectionEditor';
import { ThemeSectionEditor } from './components/ThemeSectionEditor';

/**
 * Content Management Page - Admin interface for editing homepage content
 * Refactored to use modular section editors and centralized content management
 */
export default function ContentManagementPage() {
  const toast = useToast();
  const { content, setContent, loading, saving, saveContent, isAuthenticated } = useContentManagement();

  const handleSave = async () => {
    const result = await saveContent(content);
    
    if (result.success) {
      toast({
        title: 'Content saved',
        description: 'Homepage content has been updated successfully',
        status: 'success',
        duration: 3000,
      });
      
      // Reload after save to get fresh server-rendered content
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to save content',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSectionChange = (sectionKey, sectionData) => {
    setContent({
      ...content,
      [sectionKey]: sectionData,
    });
  };

  if (!isAuthenticated || loading) {
    return (
      <AdminSidebarWrapper>
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <Spinner size="xl" color="brand.500" thickness="4px" />
        </Box>
      </AdminSidebarWrapper>
    );
  }

  return (
    <AdminSidebarWrapper>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <Box>
              <Heading size="2xl" color="text.main" mb={2}>
                Content Management
              </Heading>
              <Text color="text.secondary" fontSize="lg">
                Edit homepage content and sections
              </Text>
            </Box>
            <Button
              bg="brand.500"
              color="white"
              onClick={handleSave}
              isLoading={saving}
              _hover={{ bg: 'brand.600' }}
            >
              Save Changes
            </Button>
          </HStack>

          <GlassCard p={6}>
            <Tabs colorScheme="brand">
              <TabList>
                <Tab>Hero Section</Tab>
                <Tab>Services</Tab>
                <Tab>Why Choose Us</Tab>
                <Tab>Comparison</Tab>
                <Tab>FAQ</Tab>
                <Tab>CTA Section</Tab>
                <Tab>Theme</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <HeroSectionEditor
                    section={content.hero}
                    onChange={(section) => handleSectionChange('hero', section)}
                  />
                </TabPanel>

                <TabPanel>
                  <ServicesSectionEditor
                    section={content.services}
                    onChange={(section) => handleSectionChange('services', section)}
                  />
                </TabPanel>

                <TabPanel>
                  <WhyChooseUsSectionEditor
                    section={content.whyChooseUs}
                    onChange={(section) => handleSectionChange('whyChooseUs', section)}
                  />
                </TabPanel>

                <TabPanel>
                  <ComparisonSectionEditor
                    section={content.comparison}
                    onChange={(section) => handleSectionChange('comparison', section)}
                  />
                </TabPanel>

                <TabPanel>
                  <FAQSectionEditor
                    section={content.faq}
                    onChange={(section) => handleSectionChange('faq', section)}
                  />
                </TabPanel>

                <TabPanel>
                  <CTASectionEditor
                    section={content.cta}
                    onChange={(section) => handleSectionChange('cta', section)}
                  />
                </TabPanel>

                <TabPanel>
                  <ThemeSectionEditor
                    section={content.theme}
                    onChange={(section) => handleSectionChange('theme', section)}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GlassCard>
        </VStack>
      </Container>
    </AdminSidebarWrapper>
  );
}
