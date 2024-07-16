<?php

namespace App\Controller;

use App\Entity\Service;
use App\Repository\ServiceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use DateTimeImmutable;


#[Route('api/service', name:'app_api_service_')]
class ServiceController extends AbstractController

{
    public function __construct(
        private EntityManagerInterface $manager, 
        private ServiceRepository $repository,
        private SerializerInterface $serializer,
        private UrlGeneratorInterface $urlGenerator,
        )
    {
    }
  #[Route(methods: 'POST')]
  public function new(Request $request): JsonResponse
  {
      $service = $this->serializer->deserialize(
          $request->getContent(),
          Service::class,
          'json'
      );
      $service->setCreatedAt(new DateTimeImmutable());

      // Tell Doctrine you want to (eventually) save the service (no queries yet) 
      $this->manager->persist($service);
      // Actually executes the queries (i.e. the INSERT query)
      $this->manager->flush();

      $responseData = $this->serializer->serialize($service, 'json');
      $location = $this->urlGenerator->generate(
          'app_api_service_show',
          ['id' => $service->getId()],
          UrlGeneratorInterface::ABSOLUTE_URL
      );
      return new JsonResponse($responseData, Response::HTTP_CREATED, ["Location" => $location], true);
  }


   #[Route('/{id}', name: 'show', methods: 'GET')]
   public function show(int $id): JsonResponse
   {
       $service = $this->repository->findOneBy(['id' => $id]);

       if (!$service) {
           return new JsonResponse(data: null, status: Response::HTTP_NOT_FOUND);
       }

       $responseData = $this->serializer->serialize($service, 'json');
       return new JsonResponse(data: $responseData, status: Response::HTTP_OK, json: true);
   }

   #[Route('/{id}', name: 'edit', methods: 'PUT')]
   public function edit(int $id): JsonResponse
   {
       $service = $this->repository->findOneBy(['id' => $id]);
       if (!$service) {
           $this->manager->flush();
           return new JsonResponse(data: null, status: Response::HTTP_NO_CONTENT);
       }

       return new JsonResponse(data: null, status: Response::HTTP_NOT_FOUND);
   }

   #[Route('/{id}', name: 'delete', methods: 'DELETE')]
   public function delete(int $id): JsonResponse
   {
       $service = $this->repository->findOneBy(['id' => $id]);
       if (!$service) {
           return new JsonResponse(data: null, status: Response::HTTP_NOT_FOUND);
       }

       $this->manager->remove($service);
       $this->manager->flush();

       return new JsonResponse(data: null, status: Response::HTTP_NO_CONTENT);
   }
}