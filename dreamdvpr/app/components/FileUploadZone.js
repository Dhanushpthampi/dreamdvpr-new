'use client';

import { useState, useRef } from 'react';
import { Box, VStack, HStack, Text, Icon, Progress, IconButton, List, ListItem } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

/**
 * File upload zone with drag-and-drop support
 * @param {Object} props
 * @param {function} props.onFilesSelected - Callback when files are selected
 * @param {Array} props.acceptedTypes - Accepted file MIME types
 * @param {number} props.maxSize - Max file size in bytes (default: 10MB)
 * @param {boolean} props.multiple - Allow multiple files
 */
const FileUploadZone = ({
    onFilesSelected,
    acceptedTypes = ['*/*'],
    maxSize = 10 * 1024 * 1024, // 10MB
    multiple = true,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const validateFile = (file) => {
        if (file.size > maxSize) {
            return `File ${file.name} is too large. Max size is ${maxSize / 1024 / 1024}MB`;
        }
        return null;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        processFiles(droppedFiles);
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        processFiles(selectedFiles);
    };

    const processFiles = (newFiles) => {
        const validFiles = [];
        const errors = [];

        newFiles.forEach(file => {
            const error = validateFile(file);
            if (error) {
                errors.push(error);
            } else {
                validFiles.push(file);
            }
        });

        if (errors.length > 0) {
            alert(errors.join('\n'));
        }

        if (validFiles.length > 0) {
            const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
            setFiles(updatedFiles);
            if (onFilesSelected) {
                onFilesSelected(updatedFiles);
            }
        }
    };

    const removeFile = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        if (onFilesSelected) {
            onFilesSelected(updatedFiles);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <VStack spacing={4} w="full">
            <Box
                w="full"
                p={8}
                border="2px dashed"
                borderColor={isDragging ? 'brand.500' : 'gray.300'}
                bg={isDragging ? 'brand.50' : 'rgba(255, 255, 255, 0.6)'}
                rounded="xl"
                textAlign="center"
                cursor="pointer"
                transition="all 0.2s"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                _hover={{ borderColor: 'brand.400', bg: 'brand.50' }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple={multiple}
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />

                <Icon viewBox="0 0 24 24" boxSize={12} color="brand.500" mb={4}>
                    <path
                        fill="currentColor"
                        d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
                    />
                </Icon>

                <Text fontWeight="semibold" color="gray.700" mb={1}>
                    {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
                </Text>
                <Text fontSize="sm" color="gray.500">
                    Max file size: {maxSize / 1024 / 1024}MB
                </Text>
            </Box>

            {files.length > 0 && (
                <List spacing={2} w="full">
                    {files.map((file, index) => (
                        <ListItem key={index}>
                            <HStack
                                p={3}
                                bg="rgba(255, 255, 255, 0.8)"
                                rounded="lg"
                                justify="space-between"
                            >
                                <HStack flex={1} overflow="hidden">
                                    <Icon viewBox="0 0 24 24" boxSize={5} color="brand.500">
                                        <path
                                            fill="currentColor"
                                            d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
                                        />
                                    </Icon>
                                    <VStack align="start" spacing={0} flex={1} overflow="hidden">
                                        <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                            {file.name}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            {formatFileSize(file.size)}
                                        </Text>
                                    </VStack>
                                </HStack>
                                <IconButton
                                    icon={<CloseIcon />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="red"
                                    onClick={() => removeFile(index)}
                                    aria-label="Remove file"
                                />
                            </HStack>
                        </ListItem>
                    ))}
                </List>
            )}

            {uploading && (
                <Box w="full">
                    <Progress value={uploadProgress} colorScheme="brand" rounded="full" />
                    <Text fontSize="sm" color="gray.600" mt={2} textAlign="center">
                        Uploading... {uploadProgress}%
                    </Text>
                </Box>
            )}
        </VStack>
    );
};

export default FileUploadZone;
