package com.tuankhoi.backend.service.Impl;

import com.tuankhoi.backend.dto.request.CommentRequest;
import com.tuankhoi.backend.dto.response.CommentResponse;
import com.tuankhoi.backend.exception.AppException;
import com.tuankhoi.backend.exception.ErrorCode;
import com.tuankhoi.backend.mapper.CommentMapper;
import com.tuankhoi.backend.model.Comment;
import com.tuankhoi.backend.model.Post;
import com.tuankhoi.backend.repository.CommentRepository;
import com.tuankhoi.backend.repository.PostRepository;
import com.tuankhoi.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final CommentMapper commentMapper;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public CommentResponse addComment(CommentRequest commentRequest) {
        Post existingPost = postRepository.findById(commentRequest.getPostId())
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOTFOUND));

        Comment newComment = commentMapper.toEntity(commentRequest);
        newComment.setPost(existingPost);

        if (commentRequest.getParentCommentId() != null) {
            Comment parentComment = commentRepository.findById(commentRequest.getParentCommentId())
                    .orElseThrow(() -> new AppException(ErrorCode.PARENT_COMMENT_NOTFOUND));
            newComment.setParentComment(parentComment);
        } else {
            newComment.setParentComment(null);
        }
        Comment savedComment = commentRepository.save(newComment);
        CommentResponse commentResponse = commentMapper.toResponse(savedComment);
        messagingTemplate.convertAndSend("/topic/comments/" + existingPost.getId(), commentResponse);
        return commentResponse;
    }

    @Override
    public List<CommentResponse> getCommentsByPostId(String postId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Comment> commentList = commentRepository.findByPostIdAndParentCommentIsNullOrderByCreatedDateDesc(postId, pageable);

        return commentList.stream().map(commentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommentResponse> getRepliesByCommentId(Long commentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Comment> commentList = commentRepository.findRepliesByCommentId(commentId, pageable);
        return commentList.stream().map(commentMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public CommentResponse updateComment(Long commentId, CommentRequest commentRequest) {
        try {
            Comment existingComment = commentRepository.findById(commentId)
                    .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
            existingComment.setContent(commentRequest.getContent());
            Comment updatedComment = commentRepository.save(existingComment);
            CommentResponse commentResponse = commentMapper.toResponse(updatedComment);
            messagingTemplate.convertAndSend("/topic/comments/" + existingComment.getPost().getId() + "/update", commentResponse);
            return commentResponse;
        } catch (DataIntegrityViolationException | ConstraintViolationException e) {
            throw new AppException(ErrorCode.DATA_INTEGRITY_VIOLATION, "Failed to update post due to database constraint: " + e.getMessage(), e);
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION, "Failed to update comment: " + e.getMessage(), e);
        }
    }

//    @Override
//    public List<CommentResponse> getAllReplyCommentsByCommentId(Long commentId, int page, int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        List<Comment> commentList = commentRepository.findAllReplyCommentsByCommentId(commentId, pageable);
//        return commentList.stream().map(commentMapper::toResponse).collect(Collectors.toList());
//    }

    @Override
    public void deleteComment(Long commentId) {
        try {
            Comment commentToDelete = commentRepository.findById(commentId)
                    .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
            commentRepository.delete(commentToDelete);
        } catch (DataIntegrityViolationException | ConstraintViolationException e) {
            throw new IllegalArgumentException("Failed to delete comment due to database constraint", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete comment", e);
        }
    }
}


