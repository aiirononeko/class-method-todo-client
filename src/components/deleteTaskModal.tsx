import { Button, Text } from '@chakra-ui/react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton
} from '@chakra-ui/react';

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

export function DeleteTaskModal(props: Props) {
	const { apiEndpoint, isOpen, onClose, task, setIsLoading } = props;

	const deleteTask = async () => {
		setIsLoading(true);
		try {
			const url = `${apiEndpoint}/task/${task.id}`;
			await fetch(url, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': import.meta.env.VITE_API_KEY
				},
				body: ''
			});
			onClose();
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
				<ModalHeader>タスクを削除</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Text>{task.title} のタスクを削除します。よろしいですか？</Text>
				</ModalBody>
				<ModalFooter>
					<Button variant="ghost" mr={3} onClick={onClose}>
						閉じる
					</Button>
					<Button colorScheme="red" onClick={deleteTask}>
						削除
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
