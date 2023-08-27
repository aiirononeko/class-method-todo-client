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
import { useEffect, useState } from 'preact/hooks';

interface Task {
	id: string;
	title: string;
	content: string;
	expiration: string;
	status: string;
}

type Props = {
	apiEndpoint: string;
	isOpen: boolean;
	onClose: any;
	task: Task;
	setIsLoading: any;
};

export function UpdateTaskModal(props: Props) {
	const { apiEndpoint, isOpen, onClose, task, setIsLoading } = props;

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [expiration, setExpiration] = useState('');
	const [status, setStatus] = useState('');
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		const { title, content, expiration, status } = task;
		setTitle(title);
		setContent(content);
		setExpiration(expiration);
		setStatus(status);
	}, [task]);

	const handleTitleChange = (e: any) => setTitle(e.target.value);
	const handleContentChange = (e: any) => setContent(e.target.value);
	const handleExpirationChange = (e: any) => setExpiration(e.target.value);

	const updateTask = async () => {
		setIsLoading(true);
		try {
			const url = `${apiEndpoint}/task/${task.id}`;
			const updatedTask = {
				title,
				content,
				expiration,
				status
			};
			const res = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': import.meta.env.VITE_API_KEY
				},
				body: JSON.stringify(updatedTask)
			});

			if (res.status === 200) onClose();
		} catch (e) {
			console.log('error', e);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>タスクを更新</ModalHeader>
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
					<Button variant="ghost" mr={3} onClick={onClose}>
						閉じる
					</Button>
					<Button colorScheme="blue" onClick={updateTask}>
						更新
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
