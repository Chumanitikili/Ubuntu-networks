import { io, Socket } from 'socket.io-client';
import logger from './logger';

interface WebRTCConfig {
  iceServers: RTCIceServer[];
  socketUrl: string;
}

class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private socket: Socket | null = null;
  private config: WebRTCConfig;

  constructor(config: WebRTCConfig) {
    this.config = config;
  }

  async initialize(userId: string): Promise<void> {
    try {
      this.socket = io(this.config.socketUrl, {
        auth: { userId },
      });

      this.socket.on('connect', () => {
        logger.info('WebRTC socket connected');
      });

      this.socket.on('disconnect', () => {
        logger.info('WebRTC socket disconnected');
      });

      this.socket.on('offer', async (offer: RTCSessionDescriptionInit) => {
        await this.handleOffer(offer);
      });

      this.socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
        await this.handleAnswer(answer);
      });

      this.socket.on('ice-candidate', async (candidate: RTCIceCandidateInit) => {
        await this.handleIceCandidate(candidate);
      });

      await this.setupMediaStream();
    } catch (error) {
      logger.error('Failed to initialize WebRTC:', error);
      throw error;
    }
  }

  private async setupMediaStream(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
    } catch (error) {
      logger.error('Failed to get media stream:', error);
      throw error;
    }
  }

  private async createPeerConnection(): Promise<void> {
    this.peerConnection = new RTCPeerConnection({
      iceServers: this.config.iceServers,
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket?.emit('ice-candidate', event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      // Handle incoming audio track
      const audioElement = document.createElement('audio');
      audioElement.srcObject = event.streams[0];
      audioElement.play();
    };

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });
    }
  }

  async startCall(remoteUserId: string): Promise<void> {
    try {
      await this.createPeerConnection();
      const offer = await this.peerConnection!.createOffer();
      await this.peerConnection!.setLocalDescription(offer);
      this.socket?.emit('offer', { offer, remoteUserId });
    } catch (error) {
      logger.error('Failed to start call:', error);
      throw error;
    }
  }

  private async handleOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    try {
      await this.createPeerConnection();
      await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peerConnection!.createAnswer();
      await this.peerConnection!.setLocalDescription(answer);
      this.socket?.emit('answer', { answer, remoteUserId: offer.remoteUserId });
    } catch (error) {
      logger.error('Failed to handle offer:', error);
      throw error;
    }
  }

  private async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    try {
      await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      logger.error('Failed to handle answer:', error);
      throw error;
    }
  }

  private async handleIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    try {
      await this.peerConnection!.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      logger.error('Failed to handle ICE candidate:', error);
      throw error;
    }
  }

  async endCall(): Promise<void> {
    try {
      this.localStream?.getTracks().forEach((track) => track.stop());
      this.peerConnection?.close();
      this.peerConnection = null;
      this.localStream = null;
    } catch (error) {
      logger.error('Failed to end call:', error);
      throw error;
    }
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export default WebRTCService; 