import { Button, Input } from '@chakra-ui/react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton
} from '@chakra-ui/react';
import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	FormHelperText
} from '@chakra-ui/react';
import { useState } from 'preact/hooks';

type Props = {
	apiEndpoint: string;
	isOpen: boolean;
	onClose: any;
	setIsLoading: any;
};

export function CreateTaskModal(props: Props) {
	const { apiEndpoint, isOpen, onClose, setIsLoading } = props;

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [expiration, setExpiration] = useState('');
	const [isError] = useState(false);

	const handleTitleChange = (e: any) => setTitle(e.target.value);
	const handleContentChange = (e: any) => setContent(e.target.value);
	const handleExpirationChange = (e: any) => setExpiration(e.target.value);

	const createTask = async () => {
		setIsLoading(true);
		try {
			const url = `${apiEndpoint}/task`;
			const newTask = {
				title,
				content,
				expiration
			};
			const res = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': import.meta.env.VITE_API_KEY
				},
				body: JSON.stringify(newTask)
			});

			if (res.status === 200) closeModal();
		} catch (e) {
			console.log('error', e);
		} finally {
			setIsLoading(false);
		}
	};

	const closeModal = () => {
		setTitle('');
		setContent('');
		setExpiration('');
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>タスクを新規作成</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl isInvalid={isError} mb={5}>
						<FormLabel>タイトル</FormLabel>
						<Input
							type="title"
							value={title}
							onChange={handleTitleChange}
							placeholder="晩ご飯の買い物"
						/>
						{!isError ? (
							<FormHelperText>
								登録するタスクのタイトルを入力してください
							</FormHelperText>
						) : (
							<FormErrorMessage>タイトルを入力してください</FormErrorMessage>
						)}
					</FormControl>
					<FormControl isInvalid={isError} mb={5}>
						<FormLabel>内容</FormLabel>
						<Input
							type="content"
							value={content}
							onChange={handleContentChange}
							placeholder="玉ねぎ"
						/>
						{!isError ? (
							<FormHelperText>
								登録するタスクの内容を入力してください
							</FormHelperText>
						) : (
							<FormErrorMessage>内容を入力してください</FormErrorMessage>
						)}
					</FormControl>
					<FormControl isInvalid={isError} mb={5}>
						<FormLabel>期限</FormLabel>
						<Input
							type="datetime-local"
							value={expiration}
							onChange={handleExpirationChange}
						/>
						{!isError ? (
							<FormHelperText>
								登録するタスクの期限を入力してください
							</FormHelperText>
						) : (
							<FormErrorMessage>期限を入力してください</FormErrorMessage>
						)}
					</FormControl>
				</ModalBody>

				<ModalFooter>
					<Button variant="ghost" mr={3} onClick={closeModal}>
						閉じる
					</Button>
					<Button colorScheme="blue" onClick={createTask}>
						登録
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
