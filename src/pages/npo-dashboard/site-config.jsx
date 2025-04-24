'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Save,
  ExternalLink,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Copy,
  ChevronDown,
  ChevronUp,
  Upload,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ComponentEditor } from '@/components/component-editor';
import { ColorPicker } from '@/components/color-picker';
import { ImageUploader } from '@/components/image-uploader';
import { useApi } from '@/context/ApiContext';

const uploadToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'inaethe'); // Unsigned preset
    formData.append('folder', 'inaethe'); // Bucket/folder name

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/espazza/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      console.error('Upload failed:', response.statusText);
      console.log('Response:', response);
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Define the schema for the form
const formSchema = z.object({
  organisationId: z
    .string()
    .min(2, 'Organization ID must be at least 2 characters'),
  partnerName: z.string().min(2, 'Partner name must be at least 2 characters'),
  tagline: z.string().optional(),
  about: z.string().optional(),
  cta: z.object({
    text: z.string().optional(),
  }),
  nav: z.object({
    ctaText: z.string().optional(),
  }),
  socialMedia: z.object({
    facebook: z.string().url('Please enter a valid URL').or(z.literal('')),
    twitter: z.string().url('Please enter a valid URL').or(z.literal('')),
    instagram: z.string().url('Please enter a valid URL').or(z.literal('')),
    linkedin: z.string().url('Please enter a valid URL').or(z.literal('')),
    youtube: z.string().url('Please enter a valid URL').or(z.literal('')),
    tiktok: z.string().url('Please enter a valid URL').or(z.literal('')),
    pinterest: z.string().url('Please enter a valid URL').or(z.literal('')),
    snapchat: z.string().url('Please enter a valid URL').or(z.literal('')),
  }),
  brand: z.object({
    logo: z.string().optional(),
  }),
  colors: z.object({
    lightBgColoCode: z.string().optional(),
    secondaryLighBgColorCode: z.string().optional(),
    primaryColorCode: z.string().optional(),
    primaryColor: z.string().optional(),
    accentColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    secondaryColorCode: z.string().optional(),
    textColorCode: z.string().optional(),
    progressColor: z.string().optional(),
  }),
  footer: z.object({
    bg: z.string().optional(),
    fg: z.string().optional(),
  }),
  pages: z
    .array(
      z.object({
        id: z.string().min(1, 'Page ID is required'),
        title: z.string().min(1, 'Page title is required'),
        type: z.string().optional(),
        colorCode: z.string().optional(),
        components: z.array(z.any()).optional(),
      })
    )
    .optional(),
  defaultPages: z
    .array(
      z.object({
        id: z.string().min(1, 'Page ID is required'),
        title: z.string().min(1, 'Page title is required'),
        components: z.array(z.any()).optional(),
      })
    )
    .optional(),
});

// Sample default values
const defaultValues = {
  organisationId: 'inaethe',
  partnerName: 'Inaethe',
  tagline: 'Transforming good intentions into tangible impacts.',
  about:
    "At Inaethe, we believe in the power of generosity and financial sustainability. Join us in building a community that empowers non-profit organizations to thrive while offering individuals the opportunity to earn while making a difference. Together, let's create a brighter future.",
  cta: {
    text: 'Make an Impact Today!',
  },
  nav: {
    ctaText: 'Get started',
  },
  socialMedia: {
    facebook: 'https://www.facebook.com/inaethe',
    twitter: 'https://twitter.com/inaethe',
    instagram: 'https://www.instagram.com/inaethe',
    linkedin: 'https://www.linkedin.com/company/inaethe',
    youtube: '',
    tiktok: '',
    pinterest: '',
    snapchat: '',
  },
  brand: {
    logo: '/logo.png',
  },
  colors: {
    lightBgColoCode: 'pink-50',
    secondaryLighBgColorCode: 'gray-100',
    primaryColorCode: 'pink-500',
    primaryColor: 'pink',
    accentColor: 'indigo',
    secondaryColor: 'gray',
    secondaryColorCode: 'gray-700',
    textColorCode: 'gray-700',
    progressColor: '#d946ef',
  },
  footer: {
    bg: 'bg-gray-800',
    fg: 'text-white',
  },
  pages: [
    {
      id: 'homepage',
      title: 'Home',
      components: [
        {
          type: 'hero',
          header: 'Transforming good intentions into tangible impacts.',
          text: "At Inaethe, we believe in the power of generosity and financial sustainability. Join us in building a community that empowers non-profit organizations to thrive while offering individuals the opportunity to earn while making a difference. Together, let's create a brighter future.",
          cta: {
            title: 'Make an Impact Today!',
            link: '/subscribe',
          },
          logo: {
            src: '/logo.png',
            alt: 'Inaethe logo',
          },
          image: '/images/inaethe/home-page-header.jpg',
        },
        {
          type: 'article',
          image: '/images/inaethe/garbage.jpg',
          elements: [
            {
              type: 'image-block',
              image: '/images/inaethe/garbage.jpg',
            },
            {
              type: 'multi-text-blocks',
              cta: {
                title: 'Subscribe',
                link: '/subscribe',
              },
              content: [
                {
                  title: 'Our Mission',
                  text: 'At Inaethe, our mission is twofold: we empower non-profit organizations to generate crucial income for their causes, while simultaneously providing individuals with the opportunity to earn while helping these causes thrive. We believe in the power of mutual benefit, creating a platform where generosity and financial sustainability coexist.',
                },
                {
                  title: '',
                  text: 'Join us in building a community that transforms good intentions into tangible impacts, ensuring a brighter future for both individuals and the non-profits they support. Inaethe make a difference today!',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'about',
      title: 'About',
      type: 'color-page',
      colorCode: 'gray-900',
      components: [
        {
          type: 'FlexwindHero3',
          title: 'Who We Are & Why We Exist',
          description:
            'Inaethe was born from a deep desire to tackle hunger and unemployment in Africa. We unite generosity with opportunity, creating a space where non-profits can thrive and individuals can earn while making a real difference. This is our story—and our mission.',
          ctas: [
            {
              text: 'Join the Movement',
              link: '/register',
            },
          ],
          hint: 'Empowering Causes, Sustaining Change',
          img: {
            src: '/images/inaethe/donations-square.jpg',
            alt: 'Community members working together to support a cause',
          },
        },
      ],
    },
  ],
  defaultPages: [
    {
      id: 'subscribe-return-without-first-payment-done',
      title: 'Subscribe',
      components: [
        { type: 'space-above', size: '10' },
        {
          type: 'center-width-text-block',
          title: 'Your Information Is Saved:',
          text: 'Your details have been securely saved to our database, ensuring a seamless experience as you embark on your journey of giving back. Rest assured, your support is in good hands.',
        },
      ],
    },
  ],
};

// User-friendly color options
const colorOptions = [
  { value: 'slate', label: 'Dark Gray', color: '#64748b' },
  { value: 'gray', label: 'Gray', color: '#6b7280' },
  { value: 'zinc', label: 'Zinc Gray', color: '#71717a' },
  { value: 'neutral', label: 'Neutral Gray', color: '#737373' },
  { value: 'stone', label: 'Stone Gray', color: '#78716c' },
  { value: 'red', label: 'Red', color: '#ef4444' },
  { value: 'orange', label: 'Orange', color: '#f97316' },
  { value: 'amber', label: 'Amber', color: '#f59e0b' },
  { value: 'yellow', label: 'Yellow', color: '#eab308' },
  { value: 'lime', label: 'Lime Green', color: '#84cc16' },
  { value: 'green', label: 'Green', color: '#22c55e' },
  { value: 'emerald', label: 'Emerald', color: '#10b981' },
  { value: 'teal', label: 'Teal', color: '#14b8a6' },
  { value: 'cyan', label: 'Cyan', color: '#06b6d4' },
  { value: 'sky', label: 'Sky Blue', color: '#0ea5e9' },
  { value: 'blue', label: 'Blue', color: '#3b82f6' },
  { value: 'indigo', label: 'Indigo', color: '#6366f1' },
  { value: 'violet', label: 'Violet', color: '#8b5cf6' },
  { value: 'purple', label: 'Purple', color: '#a855f7' },
  { value: 'fuchsia', label: 'Fuchsia', color: '#d946ef' },
  { value: 'pink', label: 'Pink', color: '#ec4899' },
  { value: 'rose', label: 'Rose', color: '#f43f5e' },
];

// User-friendly shade options
const shadeOptions = [
  { value: '50', label: 'Very Light', description: 'Almost white' },
  { value: '100', label: 'Extra Light', description: 'Very pale' },
  { value: '200', label: 'Light', description: 'Pale' },
  { value: '300', label: 'Medium Light', description: 'Soft' },
  { value: '400', label: 'Medium', description: 'Moderate' },
  { value: '500', label: 'Standard', description: 'Default intensity' },
  { value: '600', label: 'Medium Dark', description: 'Rich' },
  { value: '700', label: 'Dark', description: 'Bold' },
  { value: '800', label: 'Extra Dark', description: 'Deep' },
  { value: '900', label: 'Very Dark', description: 'Intense' },
];

// Component type options with categories
const componentTypes = [
  // Content Blocks
  { value: 'article', label: 'Article', category: 'Content Blocks' },
  {
    value: 'center-width-text-block',
    label: 'Centered Text Block',
    category: 'Content Blocks',
  },

  // Hero Sections
  { value: 'hero', label: 'Hero Section', category: 'Hero Sections' },
  {
    value: 'FlexwindHero1',
    label: 'Flexwind Hero 1',
    category: 'Hero Sections',
  },
  {
    value: 'FlexwindHero2',
    label: 'Flexwind Hero 2',
    category: 'Hero Sections',
  },
  {
    value: 'FlexwindHero3',
    label: 'Flexwind Hero 3',
    category: 'Hero Sections',
  },
  {
    value: 'FlexwindHero4',
    label: 'Flexwind Hero 4',
    category: 'Hero Sections',
  },
  {
    value: 'FlexwindHero5',
    label: 'Flexwind Hero 5',
    category: 'Hero Sections',
  },
  {
    value: 'FlexwindHero6',
    label: 'Flexwind Hero 6',
    category: 'Hero Sections',
  },
  {
    value: 'FlexwindHero7',
    label: 'Flexwind Hero 7',
    category: 'Hero Sections',
  },

  // Feature Blocks
  { value: 'spa-block', label: 'Features Block', category: 'Feature Blocks' },
  {
    value: 'FlexwindFeatures1',
    label: 'Flexwind Features',
    category: 'Feature Blocks',
  },

  // Cards
  { value: 'card', label: 'Card', category: 'Cards' },

  // Interactive Elements
  { value: 'accordion', label: 'Accordion', category: 'Interactive Elements' },

  // Notifications
  { value: 'alert-banner', label: 'Alert Banner', category: 'Notifications' },

  // Layout Components
  {
    value: 'centered-page-header',
    label: 'Centered Page Header',
    category: 'Layout Components',
  },
  {
    value: 'centered-page-components-container',
    label: 'Centered Components Container',
    category: 'Layout Components',
  },
  { value: 'space-above', label: 'Space Above', category: 'Layout Components' },
  { value: 'space-below', label: 'Space Below', category: 'Layout Components' },

  // Action Components
  {
    value: 'payfast-button-center-width',
    label: 'PayFast Button',
    category: 'Action Components',
  },
  {
    value: 'login-button-center-width',
    label: 'Login Button',
    category: 'Action Components',
  },
  {
    value: 'checkbox-center',
    label: 'Centered Checkbox',
    category: 'Action Components',
  },
  {
    value: 'cross-center',
    label: 'Centered Cross',
    category: 'Action Components',
  },

  // How It Works
  {
    value: 'PageDoneHowItWorks1',
    label: 'How It Works',
    category: 'How It Works',
  },
];

// Function to group component types by category
const getComponentTypesByCategory = () => {
  const categories = {};

  componentTypes.forEach((type) => {
    if (!categories[type.category]) {
      categories[type.category] = [];
    }
    categories[type.category].push(type);
  });

  return categories;
};

// Page type options
const pageTypes = [
  { value: 'standard', label: 'Standard Page' },
  { value: 'color-page', label: 'Color Page' },
  { value: 'centered-color-page', label: 'Centered Color Page' },
];

export default function SiteConfigPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewConfig, setPreviewConfig] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [selectedPageIndex, setSelectedPageIndex] = useState(null);
  const [selectedDefaultPageIndex, setSelectedDefaultPageIndex] =
    useState(null);
  const [selectedComponentIndex, setSelectedComponentIndex] = useState(null);
  const [isDefaultPage, setIsDefaultPage] = useState(false);
  const [showComponentEditor, setShowComponentEditor] = useState(false);
  const [currentComponent, setCurrentComponent] = useState(null);
  const [showPageDialog, setShowPageDialog] = useState(false);
  const [newPage, setNewPage] = useState({
    id: '',
    title: '',
    type: '',
    colorCode: '',
  });

  const api = useApi();
  // Initialize the form with default values
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Handle form submission
  async function onSubmit(data) {
    setIsSubmitting(true);

    try {
      // In a real application, you would send this data to your API
      console.log('Form data:', JSON.stringify(data, null, 2));
      const confg = {
        ...data,
        colors: {
          ...data.colors,
          primaryColorCode:
            data.colors.primaryColor + '-' + data.colors.primaryColorCode,
          secondaryColorCode:
            data.colors.secondaryColor + '-' + data.colors.primaryColorCode,
          accentColorCode:
            data.colors.accentColor + '-' + data.colors.primaryColorCode,
        },
      };

      api
        .addSiteConfig({
          orgName: data.organisationId,
          config: confg,
          customeDomain: `${data.organisationId}.inaethe.co.za`,
        })
        .then((response) => {
          console.log('Response:', response);
          toast({
            title: 'Configuration saved',
            description: 'Your site configuration has been successfully saved.',
          });
          router.push(
            `/npo-dashboard/site?domain=${data.organisationId}.inaethe.co.za&orgId=${data.organisationId}`
          );
        })
        .catch((e) => {
          console.log('Error:', e);
          toast({
            title: 'Error',
            description:
              'There was a problem saving your configuration. Please try again.',
            variant: 'destructive',
          });
        });

      // Show success message

      // Update preview
      setPreviewConfig(data);

      // In a real app, you might redirect or refresh data
      // router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: 'Error',
        description:
          'There was a problem saving your configuration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Generate a preview of the JSON configuration
  const generatePreview = () => {
    const currentValues = form.getValues();
    setPreviewConfig(currentValues);
  };

  // Reset the form to default values
  const resetForm = () => {
    form.reset(defaultValues);
    toast({
      title: 'Form reset',
      description: 'The form has been reset to default values.',
    });
  };

  // Add a new page
  const addPage = (isDefault = false) => {
    setIsDefaultPage(isDefault);
    setNewPage({ id: '', title: '', type: '', colorCode: '' });
    setShowPageDialog(true);
  };

  // Save a new page
  const savePage = () => {
    const formValues = form.getValues();

    if (isDefaultPage) {
      const defaultPages = [...(formValues.defaultPages || [])];
      defaultPages.push({
        id: newPage.id,
        title: newPage.title,
        components: [],
      });
      form.setValue('defaultPages', defaultPages);
    } else {
      const pages = [...(formValues.pages || [])];
      pages.push({
        id: newPage.id,
        title: newPage.title,
        type: newPage.type || undefined,
        colorCode: newPage.colorCode || undefined,
        components: [],
      });
      form.setValue('pages', pages);
    }

    setShowPageDialog(false);
    toast({
      title: 'Page added',
      description: `The page "${newPage.title}" has been added successfully.`,
    });
  };

  // Delete a page
  const deletePage = (index, isDefault = false) => {
    if (
      window.confirm(
        'Are you sure you want to delete this page? This action cannot be undone.'
      )
    ) {
      const formValues = form.getValues();

      if (isDefault) {
        const defaultPages = [...(formValues.defaultPages || [])];
        defaultPages.splice(index, 1);
        form.setValue('defaultPages', defaultPages);
        if (selectedDefaultPageIndex === index) {
          setSelectedDefaultPageIndex(null);
        }
      } else {
        const pages = [...(formValues.pages || [])];
        pages.splice(index, 1);
        form.setValue('pages', pages);
        if (selectedPageIndex === index) {
          setSelectedPageIndex(null);
        }
      }

      toast({
        title: 'Page deleted',
        description: 'The page has been deleted successfully.',
      });
    }
  };

  // Duplicate a page
  const duplicatePage = (index, isDefault = false) => {
    const formValues = form.getValues();

    if (isDefault) {
      const defaultPages = [...(formValues.defaultPages || [])];
      const pageToDuplicate = defaultPages[index];
      const newPageId = `${pageToDuplicate.id}-copy`;
      const newPageTitle = `${pageToDuplicate.title} (Copy)`;

      defaultPages.push({
        ...pageToDuplicate,
        id: newPageId,
        title: newPageTitle,
      });

      form.setValue('defaultPages', defaultPages);
    } else {
      const pages = [...(formValues.pages || [])];
      const pageToDuplicate = pages[index];
      const newPageId = `${pageToDuplicate.id}-copy`;
      const newPageTitle = `${pageToDuplicate.title} (Copy)`;

      pages.push({
        ...pageToDuplicate,
        id: newPageId,
        title: newPageTitle,
      });

      form.setValue('pages', pages);
    }

    toast({
      title: 'Page duplicated',
      description: 'The page has been duplicated successfully.',
    });
  };

  // Add a component to a page
  const addComponent = (pageIndex, isDefault = false) => {
    const formValues = form.getValues();

    if (isDefault) {
      const defaultPages = [...(formValues.defaultPages || [])];
      const page = defaultPages[pageIndex];
      const components = [...(page.components || [])];

      components.push({
        type: 'center-width-text-block',
        title: 'New Component',
        text: 'This is a new component. Edit this text to customize it.',
      });

      page.components = components;
      defaultPages[pageIndex] = page;
      form.setValue('defaultPages', defaultPages);
    } else {
      const pages = [...(formValues.pages || [])];
      const page = pages[pageIndex];
      const components = [...(page.components || [])];

      components.push({
        type: 'center-width-text-block',
        title: 'New Component',
        text: 'This is a new component. Edit this text to customize it.',
      });

      page.components = components;
      pages[pageIndex] = page;
      form.setValue('pages', pages);
    }

    toast({
      title: 'Component added',
      description: 'A new component has been added to the page.',
    });
  };

  // Edit a component
  const editComponent = (pageIndex, componentIndex, isDefault = false) => {
    const formValues = form.getValues();
    let component;

    if (isDefault) {
      component =
        formValues.defaultPages?.[pageIndex]?.components?.[componentIndex];
    } else {
      component = formValues.pages?.[pageIndex]?.components?.[componentIndex];
    }

    if (component) {
      setCurrentComponent(component);
      setSelectedPageIndex(isDefault ? null : pageIndex);
      setSelectedDefaultPageIndex(isDefault ? pageIndex : null);
      setSelectedComponentIndex(componentIndex);
      setIsDefaultPage(isDefault);
      setShowComponentEditor(true);
    }
  };

  // Save edited component
  const saveComponent = (updatedComponent) => {
    const formValues = form.getValues();

    if (
      isDefaultPage &&
      selectedDefaultPageIndex !== null &&
      selectedComponentIndex !== null
    ) {
      const defaultPages = [...(formValues.defaultPages || [])];
      const page = defaultPages[selectedDefaultPageIndex];
      const components = [...(page.components || [])];

      components[selectedComponentIndex] = updatedComponent;
      page.components = components;
      defaultPages[selectedDefaultPageIndex] = page;
      form.setValue('defaultPages', defaultPages);
    } else if (
      !isDefaultPage &&
      selectedPageIndex !== null &&
      selectedComponentIndex !== null
    ) {
      const pages = [...(formValues.pages || [])];
      const page = pages[selectedPageIndex];
      const components = [...(page.components || [])];

      components[selectedComponentIndex] = updatedComponent;
      page.components = components;
      pages[selectedPageIndex] = page;
      form.setValue('pages', pages);
    }

    setShowComponentEditor(false);
    toast({
      title: 'Component updated',
      description: 'The component has been updated successfully.',
    });
  };

  // Delete a component
  const deleteComponent = (pageIndex, componentIndex, isDefault = false) => {
    if (
      window.confirm(
        'Are you sure you want to delete this component? This action cannot be undone.'
      )
    ) {
      const formValues = form.getValues();

      if (isDefault) {
        const defaultPages = [...(formValues.defaultPages || [])];
        const page = defaultPages[pageIndex];
        const components = [...(page.components || [])];

        components.splice(componentIndex, 1);
        page.components = components;
        defaultPages[pageIndex] = page;
        form.setValue('defaultPages', defaultPages);
      } else {
        const pages = [...(formValues.pages || [])];
        const page = pages[pageIndex];
        const components = [...(page.components || [])];

        components.splice(componentIndex, 1);
        page.components = components;
        pages[pageIndex] = page;
        form.setValue('pages', pages);
      }

      toast({
        title: 'Component deleted',
        description: 'The component has been deleted successfully.',
      });
    }
  };

  // Move component up
  const moveComponentUp = (pageIndex, componentIndex, isDefault = false) => {
    if (componentIndex === 0) return;

    const formValues = form.getValues();

    if (isDefault) {
      const defaultPages = [...(formValues.defaultPages || [])];
      const page = defaultPages[pageIndex];
      const components = [...(page.components || [])];

      const temp = components[componentIndex - 1];
      components[componentIndex - 1] = components[componentIndex];
      components[componentIndex] = temp;

      page.components = components;
      defaultPages[pageIndex] = page;
      form.setValue('defaultPages', defaultPages);
    } else {
      const pages = [...(formValues.pages || [])];
      const page = pages[pageIndex];
      const components = [...(page.components || [])];

      const temp = components[componentIndex - 1];
      components[componentIndex - 1] = components[componentIndex];
      components[componentIndex] = temp;

      page.components = components;
      pages[pageIndex] = page;
      form.setValue('pages', pages);
    }
  };

  // Move component down
  const moveComponentDown = (pageIndex, componentIndex, isDefault = false) => {
    const formValues = form.getValues();

    if (isDefault) {
      const defaultPages = [...(formValues.defaultPages || [])];
      const page = defaultPages[pageIndex];
      const components = [...(page.components || [])];

      if (componentIndex === components.length - 1) return;

      const temp = components[componentIndex + 1];
      components[componentIndex + 1] = components[componentIndex];
      components[componentIndex] = temp;

      page.components = components;
      defaultPages[pageIndex] = page;
      form.setValue('defaultPages', defaultPages);
    } else {
      const pages = [...(formValues.pages || [])];
      const page = pages[pageIndex];
      const components = [...(page.components || [])];

      if (componentIndex === components.length - 1) return;

      const temp = components[componentIndex + 1];
      components[componentIndex + 1] = components[componentIndex];
      components[componentIndex] = temp;

      page.components = components;
      pages[pageIndex] = page;
      form.setValue('pages', pages);
    }
  };

  // Get component type label
  const getComponentTypeLabel = (type) => {
    const componentType = componentTypes.find((ct) => ct.value === type);
    return componentType ? componentType.label : type;
  };

  // Get component categories
  const componentCategories = getComponentTypesByCategory();

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Site Configuration
          </h1>
          <p className='text-muted-foreground mt-1'>
            Customize your website appearance, content, and behavior
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={resetForm} className='gap-1'>
            <RefreshCw className='h-4 w-4' /> Reset
          </Button>
          <Button
            variant='outline'
            onClick={generatePreview}
            className='gap-1 bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200'
          >
            <ExternalLink className='h-4 w-4' /> Preview
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className='grid grid-cols-5 mb-8 bg-pink-50'>
                  <TabsTrigger
                    value='general'
                    className='data-[state=active]:bg-white data-[state=active]:text-pink-700'
                  >
                    General
                  </TabsTrigger>
                  <TabsTrigger
                    value='appearance'
                    className='data-[state=active]:bg-white data-[state=active]:text-pink-700'
                  >
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger
                    value='social'
                    className='data-[state=active]:bg-white data-[state=active]:text-pink-700'
                  >
                    Social Media
                  </TabsTrigger>
                  <TabsTrigger
                    value='pages'
                    className='data-[state=active]:bg-white data-[state=active]:text-pink-700'
                  >
                    Pages
                  </TabsTrigger>
                  <TabsTrigger
                    value='advanced'
                    className='data-[state=active]:bg-white data-[state=active]:text-pink-700'
                  >
                    Advanced
                  </TabsTrigger>
                </TabsList>

                {/* General Tab */}
                <TabsContent value='general' className='space-y-6'>
                  <Card>
                    <CardHeader>
                      <CardTitle>Organization Information</CardTitle>
                      <CardDescription>
                        Basic information about your organization
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <FormField
                        control={form.control}
                        name='organisationId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization ID</FormLabel>
                            <FormControl>
                              <Input placeholder='organization-id' {...field} />
                            </FormControl>
                            <FormDescription>
                              A unique identifier for your organization (used in
                              URLs and API calls)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='partnerName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Your Organization Name'
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              The name that will be displayed throughout the
                              site
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='tagline'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tagline</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your organization's tagline"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              A short phrase that describes your mission
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='about'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>About</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your organization's mission and values"
                                className='min-h-32'
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              A detailed description of your organization
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Call to Action</CardTitle>
                      <CardDescription>
                        Configure the primary actions for visitors
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <FormField
                        control={form.control}
                        name='cta.text'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Main CTA Text</FormLabel>
                            <FormControl>
                              <Input placeholder='Get Started' {...field} />
                            </FormControl>
                            <FormDescription>
                              Text for the main call-to-action button
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='nav.ctaText'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Navigation CTA Text</FormLabel>
                            <FormControl>
                              <Input placeholder='Sign Up' {...field} />
                            </FormControl>
                            <FormDescription>
                              Text for the call-to-action button in the
                              navigation bar
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Branding</CardTitle>
                      <CardDescription>
                        Configure your brand assets
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <FormField
                        control={form.control}
                        name='brand.logo'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Logo</FormLabel>
                            <div className='space-y-4'>
                              {field.value && (
                                <div className='flex items-center justify-center p-2 border rounded-md bg-muted/40'>
                                  <img
                                    src={field.value || '/placeholder.svg'}
                                    alt='Logo Preview'
                                    className='max-h-24 object-contain'
                                  />
                                </div>
                              )}
                              <div className='grid grid-cols-1 gap-4'>
                                <ImageUploader
                                  onUpload={async (file) => {
                                    try {
                                      setIsSubmitting(true);
                                      toast({
                                        title: 'Uploading...',
                                        description:
                                          'Your logo is being uploaded to Cloudinary.',
                                      });
                                      const url = await uploadToCloudinary(
                                        file
                                      );
                                      field.onChange(url);
                                      toast({
                                        title: 'Upload successful',
                                        description:
                                          'Your logo has been uploaded successfully.',
                                      });
                                    } catch (error) {
                                      toast({
                                        title: 'Upload failed',
                                        description:
                                          'There was a problem uploading your logo. Please try again.',
                                        variant: 'destructive',
                                      });
                                      console.error('Upload error:', error);
                                    } finally {
                                      setIsSubmitting(false);
                                    }
                                  }}
                                  buttonText='Upload Logo'
                                  buttonIcon={
                                    <Upload className='h-4 w-4 mr-2' />
                                  }
                                  buttonClassName='bg-pink-500 hover:bg-pink-600 text-white'
                                />
                                <div className='flex items-center gap-2'>
                                  <Input
                                    placeholder='Or enter a logo URL directly'
                                    value={field.value || ''}
                                    onChange={(e) =>
                                      field.onChange(e.target.value)
                                    }
                                    disabled={isSubmitting}
                                  />
                                  {field.value && (
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='icon'
                                      onClick={() => field.onChange('')}
                                      disabled={isSubmitting}
                                      className='border-pink-200 hover:bg-pink-50'
                                    >
                                      <Trash2 className='h-4 w-4 text-pink-500' />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <FormDescription>
                                Upload your logo or enter a URL directly.
                                Recommended size: 200x60px.
                              </FormDescription>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Appearance Tab */}
                <TabsContent value='appearance' className='space-y-6'>
                  <Card>
                    <CardHeader>
                      <CardTitle>Color Scheme</CardTitle>
                      <CardDescription>
                        Customize the colors used throughout your site
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormField
                          control={form.control}
                          name='colors.primaryColor'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Color</FormLabel>
                              <ColorPicker
                                value={field.value}
                                onChange={field.onChange}
                                options={colorOptions}
                              />
                              <FormDescription>
                                The main color for buttons and accents
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='colors.primaryColorCode'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Color Intensity</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={
                                  field.value?.split('-')[1] || '500'
                                }
                              >
                                <FormControl>
                                  <SelectTrigger className='border-pink-200'>
                                    <SelectValue placeholder='Select intensity' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className='bg-white'>
                                  {shadeOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      <div className='flex flex-col'>
                                        <span>{option.label}</span>
                                        <span className='text-xs text-muted-foreground'>
                                          {option.description}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                How light or dark the color should be
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='colors.accentColor'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Accent Color</FormLabel>
                              <ColorPicker
                                value={field.value}
                                onChange={field.onChange}
                                options={colorOptions}
                              />
                              <FormDescription>
                                Secondary accent color for your site
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='colors.secondaryColor'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Secondary Color</FormLabel>
                              <ColorPicker
                                value={field.value}
                                onChange={field.onChange}
                                options={colorOptions}
                              />
                              <FormDescription>
                                Used for secondary elements and backgrounds
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator />

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormField
                          control={form.control}
                          name='colors.progressColor'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Progress Color</FormLabel>
                              <div className='flex gap-2 items-center'>
                                <Input
                                  type='color'
                                  value={field.value || '#d946ef'}
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                  className='w-12 h-10 p-1 cursor-pointer'
                                />
                                <Input
                                  value={field.value || '#d946ef'}
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                  placeholder='#d946ef'
                                  className='flex-1'
                                />
                              </div>
                              <FormDescription>
                                Color for progress bars and indicators
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Footer Appearance</CardTitle>
                      <CardDescription>
                        Configure the appearance of your site footer
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormField
                          control={form.control}
                          name='footer.bg'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Footer Background</FormLabel>
                              <ColorPicker
                                value={
                                  field.value?.replace('bg-', '') || 'gray-800'
                                }
                                onChange={(value) =>
                                  field.onChange(`bg-${value}`)
                                }
                                options={colorOptions}
                                showIntensity={true}
                              />
                              <FormDescription>
                                Background color for the footer
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='footer.fg'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Footer Text Color</FormLabel>
                              <Select
                                value={
                                  field.value?.replace('text-', '') || 'white'
                                }
                                onValueChange={(value) =>
                                  field.onChange(`text-${value}`)
                                }
                              >
                                <FormControl>
                                  <SelectTrigger className='border-pink-200'>
                                    <SelectValue placeholder='Select text color' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className='bg-white'>
                                  <SelectItem value='white'>White</SelectItem>
                                  <SelectItem value='black'>Black</SelectItem>
                                  <SelectItem value='gray-200'>
                                    Light Gray
                                  </SelectItem>
                                  <SelectItem value='gray-800'>
                                    Dark Gray
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Text color for the footer
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Social Media Tab */}
                <TabsContent value='social' className='space-y-6'>
                  <Card>
                    <CardHeader>
                      <CardTitle>Social Media Links</CardTitle>
                      <CardDescription>
                        Configure your organization's social media presence
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormField
                          control={form.control}
                          name='socialMedia.facebook'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Facebook</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='https://facebook.com/yourpage'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='socialMedia.twitter'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Twitter</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='https://twitter.com/yourhandle'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='socialMedia.instagram'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Instagram</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='https://instagram.com/yourhandle'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='socialMedia.linkedin'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>LinkedIn</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='https://linkedin.com/company/yourcompany'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='socialMedia.youtube'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>YouTube</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='https://youtube.com/c/yourchannel'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='socialMedia.tiktok'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>TikTok</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='https://tiktok.com/@yourhandle'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='socialMedia.pinterest'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pinterest</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='https://pinterest.com/yourhandle'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='socialMedia.snapchat'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Snapchat</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='https://snapchat.com/add/yourhandle'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Pages Tab */}
                <TabsContent value='pages' className='space-y-6'>
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold'>Site Pages</h2>
                    <Button
                      onClick={() => addPage(false)}
                      size='sm'
                      className='gap-1 bg-pink-500 hover:bg-pink-600 text-white'
                    >
                      <Plus className='h-4 w-4' /> Add Page
                    </Button>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Main Pages</CardTitle>
                      <CardDescription>
                        Configure the main pages of your website
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className='h-[400px] pr-4'>
                        <Accordion type='single' collapsible className='w-full'>
                          {form.watch('pages')?.map((page, pageIndex) => (
                            <AccordionItem
                              key={pageIndex}
                              value={`page-${pageIndex}`}
                            >
                              <AccordionTrigger className='hover:no-underline'>
                                <div className='flex items-center gap-2'>
                                  <span>{page.title}</span>
                                  <Badge variant='outline' className='ml-2'>
                                    {page.id}
                                  </Badge>
                                  {page.type && (
                                    <Badge
                                      variant='secondary'
                                      className='ml-2 bg-pink-100 text-pink-800'
                                    >
                                      {page.type}
                                    </Badge>
                                  )}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className='space-y-4 pt-2'>
                                  <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                      <FormLabel>Page ID</FormLabel>
                                      <Input
                                        value={page.id}
                                        onChange={(e) => {
                                          const pages = [
                                            ...(form.getValues().pages || []),
                                          ];
                                          pages[pageIndex].id = e.target.value;
                                          form.setValue('pages', pages);
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <FormLabel>Page Title</FormLabel>
                                      <Input
                                        value={page.title}
                                        onChange={(e) => {
                                          const pages = [
                                            ...(form.getValues().pages || []),
                                          ];
                                          pages[pageIndex].title =
                                            e.target.value;
                                          form.setValue('pages', pages);
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <FormLabel>Page Type</FormLabel>
                                      <Select
                                        value={page.type || ''}
                                        onValueChange={(value) => {
                                          const pages = [
                                            ...(form.getValues().pages || []),
                                          ];
                                          pages[pageIndex].type = value;
                                          form.setValue('pages', pages);
                                        }}
                                      >
                                        <SelectTrigger className='border-pink-200'>
                                          <SelectValue placeholder='Select page type' />
                                        </SelectTrigger>
                                        <SelectContent className='bg-white'>
                                          {pageTypes.map((type) => (
                                            <SelectItem
                                              key={type.value}
                                              value={type.value}
                                            >
                                              {type.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <FormLabel>Background Color</FormLabel>
                                      <ColorPicker
                                        value={page.colorCode || ''}
                                        onChange={(value) => {
                                          const pages = [
                                            ...(form.getValues().pages || []),
                                          ];
                                          pages[pageIndex].colorCode = value;
                                          form.setValue('pages', pages);
                                        }}
                                        options={colorOptions}
                                        showIntensity={true}
                                      />
                                    </div>
                                  </div>

                                  <div className='flex justify-between items-center mt-4'>
                                    <h3 className='text-sm font-medium'>
                                      Components
                                    </h3>
                                    <Button
                                      onClick={() =>
                                        addComponent(pageIndex, false)
                                      }
                                      size='sm'
                                      variant='outline'
                                      className='gap-1 border-pink-200 hover:bg-pink-50 text-pink-700'
                                    >
                                      <Plus className='h-3 w-3' /> Add Component
                                    </Button>
                                  </div>

                                  <div className='space-y-2'>
                                    {page.components?.map(
                                      (component, componentIndex) => (
                                        <div
                                          key={componentIndex}
                                          className='flex items-center justify-between p-2 border rounded-md bg-muted/40'
                                        >
                                          <div className='flex items-center gap-2'>
                                            <Badge variant='outline'>
                                              {componentIndex + 1}
                                            </Badge>
                                            <span className='font-medium'>
                                              {getComponentTypeLabel(
                                                component.type
                                              )}
                                            </span>
                                            {component.title && (
                                              <span className='text-sm text-muted-foreground'>
                                                {component.title.length > 30
                                                  ? `${component.title.substring(
                                                      0,
                                                      30
                                                    )}...`
                                                  : component.title}
                                              </span>
                                            )}
                                          </div>
                                          <div className='flex items-center gap-1'>
                                            <Button
                                              onClick={() =>
                                                moveComponentUp(
                                                  pageIndex,
                                                  componentIndex,
                                                  false
                                                )
                                              }
                                              size='icon'
                                              variant='ghost'
                                              className='h-8 w-8 hover:bg-pink-50 hover:text-pink-700'
                                              disabled={componentIndex === 0}
                                            >
                                              <ChevronUp className='h-4 w-4' />
                                            </Button>
                                            <Button
                                              onClick={() =>
                                                moveComponentDown(
                                                  pageIndex,
                                                  componentIndex,
                                                  false
                                                )
                                              }
                                              size='icon'
                                              variant='ghost'
                                              className='h-8 w-8 hover:bg-pink-50 hover:text-pink-700'
                                              disabled={
                                                componentIndex ===
                                                (page.components?.length || 0) -
                                                  1
                                              }
                                            >
                                              <ChevronDown className='h-4 w-4' />
                                            </Button>
                                            <Button
                                              onClick={() =>
                                                editComponent(
                                                  pageIndex,
                                                  componentIndex,
                                                  false
                                                )
                                              }
                                              size='icon'
                                              variant='ghost'
                                              className='h-8 w-8 hover:bg-pink-50 hover:text-pink-700'
                                            >
                                              <Edit className='h-4 w-4' />
                                            </Button>
                                            <Button
                                              onClick={() =>
                                                deleteComponent(
                                                  pageIndex,
                                                  componentIndex,
                                                  false
                                                )
                                              }
                                              size='icon'
                                              variant='ghost'
                                              className='h-8 w-8 text-destructive'
                                            >
                                              <Trash2 className='h-4 w-4' />
                                            </Button>
                                          </div>
                                        </div>
                                      )
                                    )}
                                    {!page.components?.length && (
                                      <div className='text-center p-4 text-muted-foreground text-sm'>
                                        No components added yet. Click "Add
                                        Component" to get started.
                                      </div>
                                    )}
                                  </div>

                                  <div className='flex justify-end gap-2 mt-4'>
                                    <Button
                                      onClick={() =>
                                        duplicatePage(pageIndex, false)
                                      }
                                      size='sm'
                                      variant='outline'
                                      className='gap-1 border-pink-200 hover:bg-pink-50 text-pink-700'
                                    >
                                      <Copy className='h-4 w-4' /> Duplicate
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        deletePage(pageIndex, false)
                                      }
                                      size='sm'
                                      variant='destructive'
                                      className='gap-1'
                                    >
                                      <Trash2 className='h-4 w-4' /> Delete
                                    </Button>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                          {!form.watch('pages')?.length && (
                            <div className='text-center p-8 text-muted-foreground'>
                              No pages added yet. Click "Add Page" to create
                              your first page.
                            </div>
                          )}
                        </Accordion>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  <div className='flex justify-between items-center mt-8 mb-4'>
                    <h2 className='text-xl font-semibold'>Default Pages</h2>
                    <Button
                      onClick={() => addPage(true)}
                      size='sm'
                      className='gap-1 bg-pink-500 hover:bg-pink-600 text-white'
                    >
                      <Plus className='h-4 w-4' /> Add Default Page
                    </Button>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Default Pages</CardTitle>
                      <CardDescription>
                        Configure system pages like payment confirmation, login,
                        etc.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className='h-[400px] pr-4'>
                        <Accordion type='single' collapsible className='w-full'>
                          {form
                            .watch('defaultPages')
                            ?.map((page, pageIndex) => (
                              <AccordionItem
                                key={pageIndex}
                                value={`default-page-${pageIndex}`}
                              >
                                <AccordionTrigger className='hover:no-underline'>
                                  <div className='flex items-center gap-2'>
                                    <span>{page.title}</span>
                                    <Badge variant='outline' className='ml-2'>
                                      {page.id}
                                    </Badge>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className='space-y-4 pt-2'>
                                    <div className='grid grid-cols-2 gap-4'>
                                      <div>
                                        <FormLabel>Page ID</FormLabel>
                                        <Input
                                          value={page.id}
                                          onChange={(e) => {
                                            const defaultPages = [
                                              ...(form.getValues()
                                                .defaultPages || []),
                                            ];
                                            defaultPages[pageIndex].id =
                                              e.target.value;
                                            form.setValue(
                                              'defaultPages',
                                              defaultPages
                                            );
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <FormLabel>Page Title</FormLabel>
                                        <Input
                                          value={page.title}
                                          onChange={(e) => {
                                            const defaultPages = [
                                              ...(form.getValues()
                                                .defaultPages || []),
                                            ];
                                            defaultPages[pageIndex].title =
                                              e.target.value;
                                            form.setValue(
                                              'defaultPages',
                                              defaultPages
                                            );
                                          }}
                                        />
                                      </div>
                                    </div>

                                    <div className='flex justify-between items-center mt-4'>
                                      <h3 className='text-sm font-medium'>
                                        Components
                                      </h3>
                                      <Button
                                        onClick={() =>
                                          addComponent(pageIndex, true)
                                        }
                                        size='sm'
                                        variant='outline'
                                        className='gap-1 border-pink-200 hover:bg-pink-50 text-pink-700'
                                      >
                                        <Plus className='h-3 w-3' /> Add
                                        Component
                                      </Button>
                                    </div>

                                    <div className='space-y-2'>
                                      {page.components?.map(
                                        (component, componentIndex) => (
                                          <div
                                            key={componentIndex}
                                            className='flex items-center justify-between p-2 border rounded-md bg-muted/40'
                                          >
                                            <div className='flex items-center gap-2'>
                                              <Badge variant='outline'>
                                                {componentIndex + 1}
                                              </Badge>
                                              <span className='font-medium'>
                                                {getComponentTypeLabel(
                                                  component.type
                                                )}
                                              </span>
                                              {component.title && (
                                                <span className='text-sm text-muted-foreground'>
                                                  {component.title.length > 30
                                                    ? `${component.title.substring(
                                                        0,
                                                        30
                                                      )}...`
                                                    : component.title}
                                                </span>
                                              )}
                                            </div>
                                            <div className='flex items-center gap-1'>
                                              <Button
                                                onClick={() =>
                                                  moveComponentUp(
                                                    pageIndex,
                                                    componentIndex,
                                                    true
                                                  )
                                                }
                                                size='icon'
                                                variant='ghost'
                                                className='h-8 w-8 hover:bg-pink-50 hover:text-pink-700'
                                                disabled={componentIndex === 0}
                                              >
                                                <ChevronUp className='h-4 w-4' />
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  moveComponentDown(
                                                    pageIndex,
                                                    componentIndex,
                                                    true
                                                  )
                                                }
                                                size='icon'
                                                variant='ghost'
                                                className='h-8 w-8 hover:bg-pink-50 hover:text-pink-700'
                                                disabled={
                                                  componentIndex ===
                                                  (page.components?.length ||
                                                    0) -
                                                    1
                                                }
                                              >
                                                <ChevronDown className='h-4 w-4' />
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  editComponent(
                                                    pageIndex,
                                                    componentIndex,
                                                    true
                                                  )
                                                }
                                                size='icon'
                                                variant='ghost'
                                                className='h-8 w-8 hover:bg-pink-50 hover:text-pink-700'
                                              >
                                                <Edit className='h-4 w-4' />
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  deleteComponent(
                                                    pageIndex,
                                                    componentIndex,
                                                    true
                                                  )
                                                }
                                                size='icon'
                                                variant='ghost'
                                                className='h-8 w-8 text-destructive'
                                              >
                                                <Trash2 className='h-4 w-4' />
                                              </Button>
                                            </div>
                                          </div>
                                        )
                                      )}
                                      {!page.components?.length && (
                                        <div className='text-center p-4 text-muted-foreground text-sm'>
                                          No components added yet. Click "Add
                                          Component" to get started.
                                        </div>
                                      )}
                                    </div>

                                    <div className='flex justify-end gap-2 mt-4'>
                                      <Button
                                        onClick={() =>
                                          duplicatePage(pageIndex, true)
                                        }
                                        size='sm'
                                        variant='outline'
                                        className='gap-1 border-pink-200 hover:bg-pink-50 text-pink-700'
                                      >
                                        <Copy className='h-4 w-4' /> Duplicate
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          deletePage(pageIndex, true)
                                        }
                                        size='sm'
                                        variant='destructive'
                                        className='gap-1'
                                      >
                                        <Trash2 className='h-4 w-4' /> Delete
                                      </Button>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          {!form.watch('defaultPages')?.length && (
                            <div className='text-center p-8 text-muted-foreground'>
                              No default pages added yet. Click "Add Default
                              Page" to create your first default page.
                            </div>
                          )}
                        </Accordion>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Advanced Tab */}
                <TabsContent value='advanced' className='space-y-6'>
                  <Card>
                    <CardHeader>
                      <CardTitle>Advanced Settings</CardTitle>
                      <CardDescription>
                        These settings are for advanced users
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h3 className='font-medium'>
                              Export Configuration
                            </h3>
                            <p className='text-sm text-muted-foreground'>
                              Export your current configuration as JSON
                            </p>
                          </div>
                          <Button
                            type='button'
                            variant='outline'
                            className='border-pink-200 hover:bg-pink-50 text-pink-700'
                            onClick={() => {
                              const dataStr = JSON.stringify(
                                form.getValues(),
                                null,
                                2
                              );
                              const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
                                dataStr
                              )}`;
                              const exportFileDefaultName = 'site-config.json';

                              const linkElement = document.createElement('a');
                              linkElement.setAttribute('href', dataUri);
                              linkElement.setAttribute(
                                'download',
                                exportFileDefaultName
                              );
                              linkElement.click();
                            }}
                          >
                            Export
                          </Button>
                        </div>

                        <div className='flex items-center justify-between'>
                          <div>
                            <h3 className='font-medium'>
                              Import Configuration
                            </h3>
                            <p className='text-sm text-muted-foreground'>
                              Import configuration from a JSON file
                            </p>
                          </div>
                          <Button
                            type='button'
                            variant='outline'
                            className='border-pink-200 hover:bg-pink-50 text-pink-700'
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'application/json';
                              input.onchange = (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    try {
                                      const importedConfig = JSON.parse(
                                        event.target?.result
                                      );
                                      form.reset(importedConfig);
                                      toast({
                                        title: 'Configuration imported',
                                        description:
                                          'The configuration has been successfully imported.',
                                      });
                                    } catch (error) {
                                      console.error(
                                        'Error parsing JSON:',
                                        error
                                      );
                                      toast({
                                        title: 'Import failed',
                                        description:
                                          "The file could not be imported. Please ensure it's a valid JSON file.",
                                        variant: 'destructive',
                                      });
                                    }
                                  };
                                  reader.readAsText(file);
                                }
                              };
                              input.click();
                            }}
                          >
                            Import
                          </Button>
                        </div>

                        <Separator className='my-4' />

                        <div className='flex items-center justify-between'>
                          <div>
                            <h3 className='font-medium text-destructive'>
                              Reset All Settings
                            </h3>
                            <p className='text-sm text-muted-foreground'>
                              Reset all configuration to default values
                            </p>
                          </div>
                          <Button
                            type='button'
                            variant='destructive'
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Are you sure you want to reset all settings? This action cannot be undone.'
                                )
                              ) {
                                form.reset(defaultValues);
                                toast({
                                  title: 'Settings reset',
                                  description:
                                    'All settings have been reset to their default values.',
                                });
                              }
                            }}
                          >
                            Reset All
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className='flex justify-end gap-4'>
                <Button
                  type='button'
                  variant='outline'
                  className='border-pink-200 hover:bg-pink-50 text-pink-700'
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  onClick={() => {
                    console.log('performing save function');
                    return form.handleSubmit(onSubmit);
                  }}
                  className='bg-pink-500 hover:bg-pink-600 text-white'
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className='mr-2 h-4 w-4' /> Save Configuration
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Preview Panel */}
        <div className='lg:col-span-1'>
          <div className='sticky top-20'>
            <Card>
              <CardHeader>
                <CardTitle>Configuration Preview</CardTitle>
                <CardDescription>
                  Preview of your configuration in JSON format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='bg-muted rounded-md p-4 overflow-auto max-h-[600px]'>
                  <pre className='text-xs'>
                    {previewConfig
                      ? JSON.stringify(previewConfig, null, 2)
                      : "Click 'Preview' to see your configuration"}
                  </pre>
                </div>
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={generatePreview}
                  className='border-pink-200 hover:bg-pink-50 text-pink-700'
                >
                  Refresh
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='border-pink-200 hover:bg-pink-50 text-pink-700'
                  onClick={() => {
                    if (previewConfig) {
                      const dataStr = JSON.stringify(previewConfig, null, 2);
                      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
                        dataStr
                      )}`;
                      const exportFileDefaultName = 'site-config.json';

                      const linkElement = document.createElement('a');
                      linkElement.setAttribute('href', dataUri);
                      linkElement.setAttribute(
                        'download',
                        exportFileDefaultName
                      );
                      linkElement.click();
                    }
                  }}
                  disabled={!previewConfig}
                >
                  Download JSON
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Page Dialog */}
      <Dialog open={showPageDialog} onOpenChange={setShowPageDialog}>
        <DialogContent className='bg-white'>
          <DialogHeader>
            <DialogTitle>
              Add New {isDefaultPage ? 'Default ' : ''}Page
            </DialogTitle>
            <DialogDescription>
              Create a new {isDefaultPage ? 'default ' : ''}page for your
              website.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <FormLabel>Page ID</FormLabel>
              <Input
                placeholder='page-id'
                value={newPage.id}
                onChange={(e) => setNewPage({ ...newPage, id: e.target.value })}
              />
              <p className='text-sm text-muted-foreground'>
                A unique identifier for the page (used in URLs)
              </p>
            </div>
            <div className='space-y-2'>
              <FormLabel>Page Title</FormLabel>
              <Input
                placeholder='Page Title'
                value={newPage.title}
                onChange={(e) =>
                  setNewPage({ ...newPage, title: e.target.value })
                }
              />
              <p className='text-sm text-muted-foreground'>
                The title that will be displayed for this page
              </p>
            </div>
            {!isDefaultPage && (
              <>
                <div className='space-y-2'>
                  <FormLabel>Page Type</FormLabel>
                  <Select
                    value={newPage.type}
                    onValueChange={(value) =>
                      setNewPage({ ...newPage, type: value })
                    }
                  >
                    <SelectTrigger className='border-pink-200'>
                      <SelectValue placeholder='Select page type' />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                      {pageTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className='text-sm text-muted-foreground'>
                    The type of page layout to use
                  </p>
                </div>
                <div className='space-y-2'>
                  <FormLabel>Background Color</FormLabel>
                  <ColorPicker
                    value={newPage.colorCode}
                    onChange={(value) =>
                      setNewPage({ ...newPage, colorCode: value })
                    }
                    options={colorOptions}
                    showIntensity={true}
                  />
                  <p className='text-sm text-muted-foreground'>
                    Background color for the page
                  </p>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowPageDialog(false)}
              className='border-pink-200 hover:bg-pink-50 text-pink-700'
            >
              Cancel
            </Button>
            <Button
              onClick={savePage}
              disabled={!newPage.id || !newPage.title}
              className='bg-pink-500 hover:bg-pink-600 text-white'
            >
              Add Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Component Editor Dialog */}
      <Dialog open={showComponentEditor} onOpenChange={setShowComponentEditor}>
        <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto bg-white'>
          <DialogHeader>
            <DialogTitle>Edit Component</DialogTitle>
            <DialogDescription>
              Customize the properties of this component.
            </DialogDescription>
          </DialogHeader>
          {currentComponent && (
            <ComponentEditor
              component={currentComponent}
              onSave={saveComponent}
              onCancel={() => setShowComponentEditor(false)}
              uploadToCloudinary={uploadToCloudinary}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
