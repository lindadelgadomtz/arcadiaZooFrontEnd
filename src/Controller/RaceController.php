<?php

namespace App\Controller;

use App\Entity\Race;
use App\Repository\RaceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;



#[Route('api/race', name:'app_api_image_')]
class RaceController extends AbstractController

{
    public function __construct(
        private EntityManagerInterface $manager, 
        private RaceRepository $repository,
        private SerializerInterface $serializer,
        private UrlGeneratorInterface $urlGenerator,
        )
    {
    }
  #[Route(methods: 'POST')]
  public function new(Request $request): JsonResponse
  {
      $race = $this->serializer->deserialize(
          $request->getContent(),
          Race::class,
          'json'
      );
     

      // Tell Doctrine you want to (eventually) save the race (no queries yet) 
      $this->manager->persist($race);
      // Actually executes the queries (i.e. the INSERT query)
      $this->manager->flush();

      $responseData = $this->serializer->serialize($race, 'json');
      $location = $this->urlGenerator->generate(
          'app_api_race_show',
          ['id' => $race->getId()],
          UrlGeneratorInterface::ABSOLUTE_URL
      );
      return new JsonResponse($responseData, Response::HTTP_CREATED, ["Location" => $location], true);
  }


   #[Route('/{id}', name: 'show', methods: 'GET')]
   public function show(int $id): JsonResponse
   {
       $race = $this->repository->findOneBy(['id' => $id]);

       if (!$race) {
           return new JsonResponse(data: null, status: Response::HTTP_NOT_FOUND);
       }

       $responseData = $this->serializer->serialize($race, 'json');
       return new JsonResponse(data: $responseData, status: Response::HTTP_OK, json: true);
   }

   #[Route('/{id}', name: 'edit', methods: 'PUT')]
   public function edit(int $id): JsonResponse
   {
       $race = $this->repository->findOneBy(['id' => $id]);
       if (!$race) {
           $this->manager->flush();
           return new JsonResponse(data: null, status: Response::HTTP_NO_CONTENT);
       }

       return new JsonResponse(data: null, status: Response::HTTP_NOT_FOUND);
   }

   #[Route('/{id}', name: 'delete', methods: 'DELETE')]
   public function delete(int $id): JsonResponse
   {
       $race = $this->repository->findOneBy(['id' => $id]);
       if (!$race) {
           return new JsonResponse(data: null, status: Response::HTTP_NOT_FOUND);
       }

       $this->manager->remove($race);
       $this->manager->flush();

       return new JsonResponse(data: null, status: Response::HTTP_NO_CONTENT);
   }
}